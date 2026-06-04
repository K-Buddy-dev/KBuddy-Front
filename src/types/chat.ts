export type ChatRole = 'COUNSELOR' | 'CLIENT';

export interface ChatRoom {
  roomId: string;
  name: string;
}

export interface ChatRoomSummary {
  roomId: string;
  roomName: string;
  peerUserId: number;
  peerNickname: string;
  peerProfileImageUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount?: number;
}

export interface ChatMessage {
  clientMessageId?: string;
  messageType: string;
  roomId: string;
  sender: string;
  message: string;
  role: ChatRole;
  sentAt: string;
}
