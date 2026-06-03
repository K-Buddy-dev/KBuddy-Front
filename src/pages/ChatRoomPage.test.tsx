import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { ChatRoomPage } from './ChatRoomPage';
import { chatService } from '@/services/chatService';
import { analyticsService } from '@/services/analyticsService';
import { ChatMessage } from '@/types/chat';

const publishMock = vi.fn();
const subscribeMock = vi.fn();
let subscribedMessageHandler: ((message: { body: string }) => void) | undefined;
let chatMessagesData: ChatMessage[];
const activateMock = vi.fn(function (this: { connected: boolean; onConnect?: () => void }) {
  this.connected = true;
  this.onConnect?.();
});
const deactivateMock = vi.fn();

vi.mock('@stomp/stompjs', () => ({
  Client: vi.fn().mockImplementation((options) => ({
    activate: activateMock,
    connected: false,
    deactivate: deactivateMock,
    onConnect: options.onConnect,
    publish: publishMock,
    subscribe: subscribeMock.mockImplementation((_, callback) => {
      subscribedMessageHandler = callback;
      return { unsubscribe: vi.fn() };
    }),
  })),
}));

vi.mock('@/api/axiosConfig', () => ({
  authClient: {
    defaults: {
      headers: {
        common: {
          Authorization: 'Bearer token',
        },
      },
    },
  },
}));

vi.mock('@/hooks/useChatMessages', () => ({
  useChatMessages: () => ({
    data: chatMessagesData,
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

vi.mock('@/services/chatService', () => ({
  chatService: {
    getChatRoomMessages: vi.fn(),
    joinRoom: vi.fn(),
    leaveRoom: vi.fn(),
    markRoomAsRead: vi.fn(),
  },
}));

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackEvent: vi.fn(),
  },
}));

vi.mock('@/services/authService', () => ({
  authService: {
    refreshAccessToken: vi.fn(),
  },
}));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('basicUserData', JSON.stringify({ roles: ['ROLE_CLIENT'], uuid: 'user-1' }));
  chatMessagesData = [
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: '최근 메시지',
      role: 'COUNSELOR',
      sentAt: '2024-01-15T02:00:00Z',
    },
  ];
  publishMock.mockClear();
  subscribeMock.mockClear();
  subscribedMessageHandler = undefined;
  activateMock.mockClear();
  deactivateMock.mockClear();
  vi.mocked(chatService.getChatRoomMessages).mockResolvedValue([
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: '이전 메시지',
      role: 'COUNSELOR',
      sentAt: '2024-01-15T01:00:00Z',
    },
  ]);
  vi.mocked(chatService.joinRoom).mockResolvedValue();
  vi.mocked(chatService.leaveRoom).mockResolvedValue();
  vi.mocked(chatService.markRoomAsRead).mockResolvedValue();
});

it('joins the room, marks it as read, and subscribes to the room topic', async () => {
  await renderChatRoom();

  await waitFor(() => expect(chatService.joinRoom).toHaveBeenCalledWith('room-1'));
  expect(chatService.markRoomAsRead).toHaveBeenCalledWith('room-1');
  expect(subscribeMock).toHaveBeenCalledWith('/topic/room/room-1', expect.any(Function));
  expect(analyticsService.trackEvent).toHaveBeenCalledWith('chat_room_opened', {
    room_id: 'room-1',
  });
});

it('sends chat messages without role so the server can resolve it', async () => {
  const { user } = await renderChatRoom();

  await user.type(screen.getByPlaceholderText('Type a message'), 'Hello');
  await user.click(screen.getByRole('button', { name: 'Send' }));

  await waitFor(() => expect(publishMock).toHaveBeenCalled());
  const publishArg = publishMock.mock.calls[0][0];
  expect(JSON.parse(publishArg.body)).toEqual({
    clientMessageId: expect.any(String),
    messageType: 'TALK',
    roomId: 'room-1',
    message: 'Hello',
  });
  expect(analyticsService.trackEvent).toHaveBeenCalledWith('message_sent', {
    message_length: 5,
    room_id: 'room-1',
  });
});

it('does not send while Korean IME composition is being confirmed with Enter', async () => {
  await renderChatRoom();
  const input = screen.getByPlaceholderText('Type a message');

  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: '테스트' } });
  fireEvent.keyDown(input, {
    key: 'Enter',
  });

  expect(publishMock).not.toHaveBeenCalled();

  fireEvent.compositionEnd(input);
  fireEvent.keyDown(input, {
    key: 'Enter',
  });

  await waitFor(() => expect(publishMock).toHaveBeenCalledTimes(1));
  expect(JSON.parse(publishMock.mock.calls[0][0].body)).toEqual(
    expect.objectContaining({
      message: '테스트',
    })
  );
});

it('shows my sent message immediately before the websocket echo arrives', async () => {
  const { user } = await renderChatRoom();

  await user.type(screen.getByPlaceholderText('Type a message'), 'Immediate hello');
  await user.click(screen.getByRole('button', { name: 'Send' }));

  expect(await screen.findByText('Immediate hello')).toBeInTheDocument();
});

it('does not show a sending label for optimistic messages', async () => {
  const { user } = await renderChatRoom();

  await user.type(screen.getByPlaceholderText('Type a message'), 'No sending label');
  await user.click(screen.getByRole('button', { name: 'Send' }));

  expect(await screen.findByText('No sending label')).toBeInTheDocument();
  expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
});

it('does not show a guessed role for optimistic messages before the websocket echo arrives', async () => {
  const { user } = await renderChatRoom();

  await user.type(screen.getByPlaceholderText('Type a message'), 'Optimistic without role');
  await user.click(screen.getByRole('button', { name: 'Send' }));

  expect(await screen.findByText('Optimistic without role')).toBeInTheDocument();
  expect(screen.queryByText('CLIENT')).not.toBeInTheDocument();
});

it('replaces the optimistic message when the websocket echo arrives', async () => {
  const { user } = await renderChatRoom();

  await user.type(screen.getByPlaceholderText('Type a message'), 'No duplicate hello');
  await user.click(screen.getByRole('button', { name: 'Send' }));
  const publishArg = publishMock.mock.calls[0][0];
  const sentPayload = JSON.parse(publishArg.body);

  act(() => {
    subscribedMessageHandler?.({
      body: JSON.stringify({
        clientMessageId: sentPayload.clientMessageId,
        messageType: 'TALK',
        roomId: 'room-1',
        sender: 'user-1',
        message: 'No duplicate hello',
        role: 'CLIENT',
        sentAt: '2024-01-15T03:00:00Z',
      }),
    });
  });

  await waitFor(() => expect(screen.getAllByText('No duplicate hello')).toHaveLength(1));
});

it('keeps my persisted messages on the right when the sender matches my user id', async () => {
  localStorage.setItem('basicUserData', JSON.stringify({ roles: ['ROLE_CLIENT'], userId: 'john123', uuid: 'uuid-1' }));
  chatMessagesData = [
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'john123',
      message: 'My persisted message',
      role: 'CLIENT',
      sentAt: '2024-01-15T03:00:00Z',
    },
  ];

  await renderChatRoom();

  expect(screen.getByText('My persisted message').parentElement).toHaveClass('items-end');
});

it('groups messages by date and shows each message time', async () => {
  chatMessagesData = [
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: 'Next day message',
      role: 'COUNSELOR',
      sentAt: '2024-01-16T09:02:00',
    },
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'user-1',
      message: 'Afternoon message',
      role: 'CLIENT',
      sentAt: '2024-01-15T15:31:00',
    },
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: 'Morning message',
      role: 'COUNSELOR',
      sentAt: '2024-01-15T09:05:00',
    },
  ];

  await renderChatRoom();

  expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  expect(screen.getByText('January 16, 2024')).toBeInTheDocument();
  expect(screen.getByText('am 9:05')).toBeInTheDocument();
  expect(screen.getByText('pm 3:31')).toBeInTheDocument();
  expect(screen.getByText('am 9:02')).toBeInTheDocument();
});

it('renders incoming messages with the peer avatar and name', async () => {
  chatMessagesData = [
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: 'Peer bubble',
      role: 'COUNSELOR',
      sentAt: '2024-01-15T09:05:00',
    },
  ];

  await renderChatRoom({
    peerNickname: 'kimori',
    peerProfileImageUrl: 'https://example.com/kimori.png',
  });

  expect(screen.getAllByText('kimori')).toHaveLength(2);
  expect(screen.getByAltText('kimori')).toHaveAttribute('src', 'https://example.com/kimori.png');
});

it('renders incoming message bubbles with a visible background', async () => {
  chatMessagesData = [
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: 'Readable peer bubble',
      role: 'COUNSELOR',
      sentAt: '2024-01-15T09:05:00',
    },
  ];

  await renderChatRoom();

  expect(screen.getByText('Readable peer bubble')).toHaveClass('bg-[#ECEEF2]');
  expect(screen.getByText('Readable peer bubble')).not.toHaveClass('border');
});

it('hides the previous message loader when the first page is not full', async () => {
  chatMessagesData = [
    {
      messageType: 'TALK',
      roomId: 'room-1',
      sender: 'peer-1',
      message: 'Only loaded message',
      role: 'COUNSELOR',
      sentAt: '2024-01-15T09:05:00',
    },
  ];

  await renderChatRoom();

  expect(screen.queryByRole('button', { name: 'Load previous messages' })).not.toBeInTheDocument();
});

it('loads older chat messages when the message list scrolls to the top', async () => {
  chatMessagesData = Array.from({ length: 50 }, (_, index) => ({
    messageType: 'TALK',
    roomId: 'room-1',
    sender: 'peer-1',
    message: `Recent message ${index}`,
    role: 'COUNSELOR',
    sentAt: `2024-01-15T02:${String(index).padStart(2, '0')}:00Z`,
  }));
  await renderChatRoom();

  fireEvent.scroll(screen.getByLabelText('Chat messages'), { target: { scrollTop: 0 } });

  await waitFor(() => expect(chatService.getChatRoomMessages).toHaveBeenCalledWith('room-1', 1, 50));
  expect(await screen.findByText('이전 메시지')).toBeInTheDocument();
  expect(screen.getByText('Recent message 49')).toBeInTheDocument();
});

it('renders chat room controls in English', async () => {
  chatMessagesData = Array.from({ length: 50 }, (_, index) => ({
    messageType: 'TALK',
    roomId: 'room-1',
    sender: 'peer-1',
    message: `Recent message ${index}`,
    role: 'COUNSELOR',
    sentAt: `2024-01-15T02:${String(index).padStart(2, '0')}:00Z`,
  }));
  await renderChatRoom();

  expect(screen.queryByRole('button', { name: 'Load previous messages' })).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText('Type a message')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  expect(screen.queryByText('이전 메시지 보기')).not.toBeInTheDocument();
  expect(screen.queryByPlaceholderText('메시지 입력')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '전송' })).not.toBeInTheDocument();
});

it('leaves the chat room from the options menu', async () => {
  const { user } = await renderChatRoom();

  await user.click(screen.getByRole('button', { name: 'Options' }));
  await user.click(screen.getByRole('menuitem', { name: 'Leave room' }));

  await waitFor(() => expect(chatService.leaveRoom).toHaveBeenCalledWith('room-1'));
  expect(deactivateMock).toHaveBeenCalled();
  expect(await screen.findByText('Message list route')).toBeInTheDocument();
});

async function renderChatRoom(state?: Record<string, unknown>) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/message/room-1', state }]}>
      <Routes>
        <Route path="/message/:roomId" element={<ChatRoomPage />} />
        <Route path="/message" element={<div>Message list route</div>} />
      </Routes>
    </MemoryRouter>
  );
}
