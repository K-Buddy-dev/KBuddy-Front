import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { NotificationItem, NotificationPageResponse } from '@/types/notification';

const notificationRootKey = ['notifications'] as const;

export const notificationKeys = {
  all: notificationRootKey,
  list: (page: number, size: number) => [...notificationRootKey, 'list', page, size] as const,
  unread: [...notificationRootKey, 'unread'] as const,
  unreadCount: [...notificationRootKey, 'unreadCount'] as const,
};

export const useNotifications = (page: number = 0, size: number = 20) => {
  return useQuery<NotificationPageResponse, Error>({
    queryKey: notificationKeys.list(page, size),
    queryFn: () => notificationService.getNotifications({ page, size }),
  });
};

export const useUnreadNotifications = () => {
  return useQuery<NotificationItem[], Error>({
    queryKey: notificationKeys.unread,
    queryFn: () => notificationService.getUnreadNotifications(),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery<number, Error>({
    queryKey: notificationKeys.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30_000,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (notificationId) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
