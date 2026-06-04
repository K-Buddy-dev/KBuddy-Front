import { Fragment, UIEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Client, IMessage } from '@stomp/stompjs';
import { PreviewBackIcon } from '@/components/shared/icon';
import { useChatMessages } from '@/hooks/useChatMessages';
import { authClient } from '@/api/axiosConfig';
import { ChatMessage, ChatRole } from '@/types/chat';
import { authService } from '@/services/authService';
import { chatService } from '@/services/chatService';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { analyticsService } from '@/services/analyticsService';
import { analyticsEvents } from '@/services/analyticsEvents';

interface ChatRoomLocationState {
  peerProfileImageUrl?: string | null;
  roomName?: string;
  peerNickname?: string;
}

type ChatDeliveryStatus = 'sending' | 'sent' | 'failed';
type ChatDisplayMessage = Omit<ChatMessage, 'role'> & {
  role?: ChatRole;
  deliveryStatus?: ChatDeliveryStatus;
};
const messagePageSize = 50;
const olderMessageLoadThreshold = 24;

export function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const state = location.state as ChatRoomLocationState | null;
  const title = state?.roomName || state?.peerNickname || 'Chat';
  const peerDisplayName = state?.peerNickname || title;
  const peerProfileImageUrl = state?.peerProfileImageUrl || defaultProfileImage;
  const { data, isLoading, isError, error } = useChatMessages(roomId);
  const [chatMessages, setChatMessages] = useState<ChatDisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [nextMessagePage, setNextMessagePage] = useState(1);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isLeavingRoom, setIsLeavingRoom] = useState(false);
  const [leaveRoomError, setLeaveRoomError] = useState('');
  const clientRef = useRef<Client | null>(null);
  const isComposingRef = useRef(false);
  const currentUserIdentifiers = useMemo(() => getCurrentUserIdentifiers(), []);
  const currentUserId = currentUserIdentifiers[0] || '';

  const wsUrl = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.k-buddy.kr/kbuddy/v1';
    const fallbackWsBase = apiBase.replace(/^http/, 'ws').replace(/\/kbuddy\/v1\/?$/, '');
    const rawWsUrl = import.meta.env.VITE_WS_URL || fallbackWsBase;
    return rawWsUrl.endsWith('/ws-stomp') ? rawWsUrl : `${rawWsUrl}/ws-stomp`;
  }, []);

  useEffect(() => {
    if (!data) return;
    setChatMessages((prev) => (prev.length > 0 ? prev : [...data].reverse()));
    setNextMessagePage(1);
    setHasOlderMessages(data.length >= messagePageSize);
  }, [data]);

  const handleLoadOlderMessages = async () => {
    if (!roomId || isLoadingOlderMessages || !hasOlderMessages) return;

    setIsLoadingOlderMessages(true);
    try {
      const olderMessages = await chatService.getChatRoomMessages(roomId, nextMessagePage, messagePageSize);
      const olderDisplayMessages: ChatDisplayMessage[] = [...olderMessages].reverse();
      setChatMessages((prev) => [...olderDisplayMessages, ...prev]);
      setNextMessagePage((prev) => prev + 1);
      if (olderMessages.length < messagePageSize) {
        setHasOlderMessages(false);
      }
    } finally {
      setIsLoadingOlderMessages(false);
    }
  };

  const handleMessageListScroll = (event: UIEvent<HTMLDivElement>) => {
    if (event.currentTarget.scrollTop <= olderMessageLoadThreshold) {
      void handleLoadOlderMessages();
    }
  };

  useEffect(() => {
    if (!roomId) return;

    chatService.joinRoom(roomId).catch((joinError) => {
      console.error('Failed to join chat room:', joinError);
    });
    analyticsService.trackEvent(analyticsEvents.chatRoomOpened, {
      room_id: roomId,
    });
    chatService.markRoomAsRead(roomId).catch((readError) => {
      console.error('Failed to mark chat room as read:', readError);
    });

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      beforeConnect: async () => {
        const authHeader = authClient.defaults.headers.common['Authorization'] as string | undefined;
        let bearerHeader = authHeader
          ? authHeader.startsWith('Bearer ')
            ? authHeader
            : `Bearer ${authHeader}`
          : undefined;

        if (bearerHeader && /Bearer\s+(undefined|null|)$/i.test(bearerHeader)) {
          bearerHeader = undefined;
        }

        if (!bearerHeader) {
          try {
            const { data } = await authService.refreshAccessToken();
            const accessToken = data?.accessToken as string | undefined;
            if (accessToken) {
              bearerHeader = `Bearer ${accessToken}`;
              authClient.defaults.headers.common['Authorization'] = bearerHeader;
            }
          } catch (refreshError) {
            console.error('Failed to refresh access token for chat:', refreshError);
          }
        }

        client.connectHeaders = bearerHeader ? { Authorization: bearerHeader } : {};
      },
      onConnect: () => {
        client.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
          try {
            const payload = JSON.parse(message.body) as ChatMessage;
            setChatMessages((prev) => mergeReceivedMessage(prev, payload, currentUserIdentifiers));
          } catch (parseError) {
            console.error('Failed to parse chat message:', parseError);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message'], frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [currentUserIdentifiers, roomId, wsUrl]);

  const handleSend = () => {
    if (!roomId) return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!clientRef.current || !clientRef.current.connected) return;

    const authHeader = authClient.defaults.headers.common['Authorization'] as string | undefined;
    const bearerHeader = authHeader
      ? authHeader.startsWith('Bearer ')
        ? authHeader
        : `Bearer ${authHeader}`
      : undefined;
    const clientMessageId = createClientMessageId();
    const payload = {
      clientMessageId,
      messageType: 'TALK',
      roomId,
      message: trimmed,
    };
    const optimisticMessage: ChatDisplayMessage = {
      ...payload,
      sender: currentUserId,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'sending',
    };

    setChatMessages((prev) => [...prev, optimisticMessage]);

    try {
      clientRef.current.publish({
        destination: '/pub/message',
        body: JSON.stringify(payload),
        headers: {
          ...(bearerHeader ? { Authorization: bearerHeader } : {}),
          'content-type': 'application/json',
        },
      });
      analyticsService.trackEvent(analyticsEvents.messageSent, {
        message_length: trimmed.length,
        room_id: roomId,
      });
      setInputValue('');
    } catch (publishError) {
      console.error('Failed to publish chat message:', publishError);
      setChatMessages((prev) =>
        prev.map((item) => (item.clientMessageId === clientMessageId ? { ...item, deliveryStatus: 'failed' } : item))
      );
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomId || isLeavingRoom) return;

    setIsLeavingRoom(true);
    setLeaveRoomError('');
    try {
      await chatService.leaveRoom(roomId);
      analyticsService.trackEvent(analyticsEvents.chatRoomLeft, {
        room_id: roomId,
      });
      await clientRef.current?.deactivate();
      clientRef.current = null;
      navigate('/message', { replace: true });
    } catch (leaveError) {
      console.error('Failed to leave chat room:', leaveError);
      setLeaveRoomError('Unable to leave room. Please try again.');
      setIsLeavingRoom(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-default">
      <div className="absolute top-0 left-0 flex items-center justify-between min-w-[280px] w-full sm:w-[600px] h-14 bg-white py-4 pr-4 border-b border-solid border-custom-gray">
        <div className="flex items-center justify-start gap-2 min-w-0">
          <button type="button" onClick={() => navigate(-1)}>
            <PreviewBackIcon />
          </button>
          <h1 className="flex-1 min-w-0 font-roboto font-normal text-text-default text-[22px] leading-7 truncate">
            {title}
          </h1>
        </div>
        <div className="relative">
          <button
            type="button"
            aria-expanded={isOptionsOpen}
            aria-haspopup="menu"
            aria-label="Options"
            className="w-10 h-10 flex items-center justify-center"
            onClick={() => setIsOptionsOpen((prev) => !prev)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="4" r="1.5" fill="#1E1F20" />
              <circle cx="10" cy="10" r="1.5" fill="#1E1F20" />
              <circle cx="10" cy="16" r="1.5" fill="#1E1F20" />
            </svg>
          </button>
          {isOptionsOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 z-10 min-w-[152px] rounded-lg border border-border-weak1 bg-white py-1 shadow-default"
            >
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-3 text-left text-sm font-medium text-[#D31510] disabled:opacity-50"
                onClick={handleLeaveRoom}
                disabled={isLeavingRoom}
              >
                {isLeavingRoom ? 'Leaving...' : 'Leave room'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        aria-label="Chat messages"
        className="absolute left-0 right-0 top-14 bottom-[65px] overflow-y-auto px-4 py-4"
        onScroll={handleMessageListScroll}
      >
        {isLoading && <div className="text-center text-text-weak text-sm">Loading messages...</div>}
        {isError && (
          <div className="text-center text-text-weak text-sm">{error?.message || 'Unable to load messages.'}</div>
        )}
        {leaveRoomError && <div className="mb-3 text-center text-sm text-[#D31510]">{leaveRoomError}</div>}
        {!isLoading && !isError && chatMessages.length === 0 && (
          <div className="text-center text-text-weak text-sm">Start a conversation.</div>
        )}
        <div className="flex flex-col gap-3">
          {!isLoading && !isError && isLoadingOlderMessages && (
            <div className="self-center rounded-full bg-bg-medium px-3 py-1 text-xs text-text-weak">
              Loading previous messages...
            </div>
          )}
          {!isLoading &&
            !isError &&
            chatMessages.map((item, index) => {
              const isMine = isCurrentUserSender(item.sender, currentUserIdentifiers);
              const previousMessage = chatMessages[index - 1];
              const shouldShowDateSeparator =
                !previousMessage || getChatDateKey(previousMessage.sentAt) !== getChatDateKey(item.sentAt);
              return (
                <Fragment key={`${item.roomId}-${item.sentAt}-${item.sender}-${index}`}>
                  {shouldShowDateSeparator && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="h-px flex-1 bg-border-weak1" />
                      <time
                        className="rounded-full bg-bg-medium px-3 py-1 text-xs font-medium text-text-weak"
                        dateTime={getChatDateKey(item.sentAt)}
                      >
                        {formatChatDateSeparator(item.sentAt)}
                      </time>
                      <div className="h-px flex-1 bg-border-weak1" />
                    </div>
                  )}
                  <div className={`flex w-full gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    {!isMine && (
                      <img
                        src={peerProfileImageUrl}
                        alt={peerDisplayName}
                        className="mt-5 h-8 w-8 flex-shrink-0 rounded-full object-cover"
                      />
                    )}
                    <div className={`flex max-w-[78%] flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && (
                        <span className="text-xs font-medium leading-4 text-text-default">{peerDisplayName}</span>
                      )}
                      <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div
                          className={`rounded-2xl px-4 py-2 text-sm leading-5 ${
                            isMine
                              ? 'rounded-br-md bg-bg-brand-default text-text-inverted-default'
                              : 'rounded-bl-md bg-[#ECEEF2] text-text-default'
                          }`}
                        >
                          {item.message}
                        </div>
                        <div className="flex flex-col items-start gap-0.5 text-[11px] leading-3 text-text-weak">
                          {item.deliveryStatus === 'failed' && <span>Failed</span>}
                          <time dateTime={item.sentAt}>{formatChatMessageTime(item.sentAt)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-border-weak2 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 h-10 rounded-full border border-border-weak2 px-4 text-sm outline-none"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              isComposingRef.current = false;
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              if (isComposingRef.current || event.nativeEvent.isComposing || event.keyCode === 229) return;
              event.preventDefault();
              handleSend();
            }}
          />
          <button
            type="button"
            className="h-10 px-4 rounded-full bg-bg-brand-default text-text-inverted-default text-sm font-medium disabled:opacity-50"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function getCurrentUserIdentifiers() {
  const raw = localStorage.getItem('basicUserData');
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as {
      uuid?: string | number;
      userId?: string | number;
      id?: string | number;
      username?: string | number;
    };

    return [parsed.uuid, parsed.userId, parsed.id, parsed.username]
      .filter((value): value is string | number => value !== undefined && value !== null && value !== '')
      .map(String);
  } catch {
    return [];
  }
}

function isCurrentUserSender(sender: string | number | undefined, currentUserIdentifiers: string[]) {
  if (sender === undefined || sender === null) return false;
  return currentUserIdentifiers.includes(String(sender));
}

function getChatDateKey(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatChatDateSeparator(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatChatMessageTime(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '';

  const period = date.getHours() >= 12 ? 'pm' : 'am';
  const hour = date.getHours() % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${period} ${hour}:${minute}`;
}

function createClientMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function mergeReceivedMessage(
  currentMessages: ChatDisplayMessage[],
  receivedMessage: ChatMessage,
  currentUserIdentifiers: string[]
): ChatDisplayMessage[] {
  const confirmedMessage: ChatDisplayMessage = {
    ...receivedMessage,
    deliveryStatus: 'sent',
  };

  if (receivedMessage.clientMessageId) {
    const clientMessageIndex = currentMessages.findIndex(
      (message) => message.clientMessageId === receivedMessage.clientMessageId
    );

    if (clientMessageIndex >= 0) {
      return currentMessages.map((message, index) => (index === clientMessageIndex ? confirmedMessage : message));
    }
  }

  const matchingOptimisticIndex = currentMessages.findIndex(
    (message) =>
      message.deliveryStatus === 'sending' &&
      isCurrentUserSender(message.sender, currentUserIdentifiers) &&
      isCurrentUserSender(receivedMessage.sender, currentUserIdentifiers) &&
      message.roomId === receivedMessage.roomId &&
      message.message === receivedMessage.message &&
      (!message.role || message.role === receivedMessage.role)
  );

  if (matchingOptimisticIndex >= 0) {
    return currentMessages.map((message, index) => (index === matchingOptimisticIndex ? confirmedMessage : message));
  }

  const alreadyReceived = currentMessages.some(
    (message) =>
      message.roomId === receivedMessage.roomId &&
      message.sender === receivedMessage.sender &&
      message.sentAt === receivedMessage.sentAt &&
      message.message === receivedMessage.message
  );

  return alreadyReceived ? currentMessages : [...currentMessages, confirmedMessage];
}
