import { authClient } from '@/api/axiosConfig';
import { ChatMessage, ChatRoom, ChatRoomSummary } from '@/types/chat';

interface CreateChatRoomRequest {
  clientId: number | string;
  counselorId: number | string;
  name: string;
}

export const chatService = {
  createRoom: async ({ clientId, counselorId, name }: CreateChatRoomRequest): Promise<void> => {
    await authClient.post('/chat/room', null, {
      params: {
        clientId,
        counselorId,
        name,
      },
    });
  },
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await authClient.get<ChatRoom[]>('/chat/rooms');
    return response.data;
  },
  getChatRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await authClient.get<ChatRoom>(`/chat/room/${roomId}`);
    return response.data;
  },
  getRoomByBooking: async (bookingId: number | string): Promise<ChatRoom> => {
    const response = await authClient.get<ChatRoom>(`/chat/bookings/${bookingId}/room`);
    return response.data;
  },
  joinRoom: async (roomId: string): Promise<void> => {
    await authClient.post(`/chat/room/${roomId}/join`);
  },
  leaveRoom: async (roomId: string): Promise<void> => {
    await authClient.post(`/chat/room/${roomId}/leave`);
  },
  markRoomAsRead: async (roomId: string): Promise<void> => {
    await authClient.patch(`/chat/rooms/${roomId}/read`);
  },
  getMyChatRooms: async (): Promise<ChatRoomSummary[]> => {
    const response = await authClient.get<ChatRoomSummary[] | { data: ChatRoomSummary[] }>('/chat/users/me/rooms');
    const payload = response.data;
    return Array.isArray(payload) ? payload : payload.data;
  },
  getChatRoomMessages: async (roomId: string, page: number = 0, size: number = 50): Promise<ChatMessage[]> => {
    const response = await authClient.get<ChatMessage[] | { data: ChatMessage[] }>(`/chat/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    const payload = response.data;
    return Array.isArray(payload) ? payload : payload.data;
  },
};
