export type NotificationType =
  | 'CHAT_MESSAGE_NOTIFICATION'
  | 'BOOKING_NOTIFICATION'
  | 'BOOKING_CREATED_NOTIFICATION'
  | 'BOOKING_STATUS_CHANGED_NOTIFICATION'
  | 'COMMUNITY_COMMENT_NOTIFICATION'
  | 'SERVICE_INQUIRY_NOTIFICATION'
  | string;

export interface NotificationItem {
  id: number;
  isRead: boolean;
  title: string;
  message: string;
  targetId: string;
  type: NotificationType;
  createdAt: string;
}

export interface NotificationPageResponse {
  content: NotificationItem[];
  totalElements?: number;
  totalPages?: number;
}
