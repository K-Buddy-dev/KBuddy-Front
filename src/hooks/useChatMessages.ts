import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';

export const useChatMessages = (roomId: string | undefined) => {
  return useQuery<ChatMessage[], Error>({
    queryKey: ['chatMessages', roomId],
    queryFn: () => chatService.getChatRoomMessages(roomId as string),
    enabled: Boolean(roomId),
  });
};
