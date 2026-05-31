import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/shared/navbar/Navbar';
import { MessageListItem } from '@/components/message';
import { Message } from '@/types/message';
import { useChatRooms } from '@/hooks/useChatRooms';
import defaultProfileImage from '@/assets/images/default-profile.png';

const emptyPreviewText = '아직 메시지가 없습니다';

export function MessagePage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useChatRooms();

  const handleMessageClick = (messageId: string) => {
    const selectedRoom = messages.find((room) => room.id === messageId);
    navigate(`/message/${messageId}`, {
      state: {
        peerProfileImageUrl: selectedRoom?.avatar ?? null,
        roomName: selectedRoom?.title ?? 'Chat',
        peerNickname: selectedRoom?.userId ?? '',
      },
    });
  };

  const messages = useMemo<Message[]>(() => {
    if (!data) return [];
    return data.map((room) => ({
      id: room.roomId,
      avatar: room.peerProfileImageUrl || defaultProfileImage,
      userId: room.peerNickname,
      title: room.roomName,
      preview: room.lastMessage ?? emptyPreviewText,
      time: room.lastMessageAt ? formatChatRoomListTime(room.lastMessageAt) : '',
      isRead: !room.unreadCount,
      hasBusinessMark: false,
    }));
  }, [data]);

  // Filter messages based on search keyword
  const filteredMessages = searchKeyword
    ? messages.filter(
        (message) =>
          message.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          message.preview.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          message.userId.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : messages;

  return (
    <>
      <Navbar withSearch setSearchKeyword={setSearchKeyword} />

      <div className="pb-20">
        {isLoading && <div className="flex items-center justify-center h-64 text-text-weak">불러오는 중...</div>}
        {isError && (
          <div className="flex items-center justify-center h-64 text-text-weak">
            {error?.message || '채팅방 목록을 불러오지 못했습니다.'}
          </div>
        )}
        {!isLoading && !isError && filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageListItem key={message.id} message={message} onClick={() => handleMessageClick(message.id)} />
          ))
        ) : !isLoading && !isError ? (
          <div className="flex items-center justify-center h-64 text-text-weak">검색 결과가 없습니다</div>
        ) : null}
      </div>
    </>
  );
}

function formatChatRoomListTime(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '';

  const todayKey = getLocalDateKey(new Date());
  const messageDateKey = getLocalDateKey(date);

  if (messageDateKey === todayKey) {
    return formatChatRoomTime(date);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDateKey === getLocalDateKey(yesterday)) {
    return 'Yesterday';
  }

  const isSameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    ...(isSameYear ? {} : { year: 'numeric' }),
  }).format(date);
}

function formatChatRoomTime(date: Date) {
  const period = date.getHours() >= 12 ? 'pm' : 'am';
  const hour = date.getHours() % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${period} ${hour}:${minute}`;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
