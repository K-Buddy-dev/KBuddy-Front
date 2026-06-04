import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { ChatRoomSummary } from '@/types/chat';

export const useChatRooms = () => {
  return useQuery<ChatRoomSummary[], Error>({
    queryKey: ['chatRooms'],
    queryFn: () => chatService.getMyChatRooms(),
  });
};
