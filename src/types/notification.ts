export type NotificationType =
  | 'CHAT_MESSAGE_NOTIFICATION'
  | 'BOOKING_REQUEST_NOTIFICATION'
  | 'BOOKING_CANCELLED_NOTIFICATION'
  | 'INQUIRY_NOTIFICATION'
  | 'INQUIRY_REPLY_NOTIFICATION'
  | 'BLOG_LIKE_NOTIFICATION'
  | 'BLOG_COMMENT_NOTIFICATION'
  | 'BLOG_COMMENT_LIKE_NOTIFICATION'
  | 'QNA_LIKE_NOTIFICATION'
  | 'QNA_COMMENT_NOTIFICATION'
  | 'QNA_COMMENT_LIKE_NOTIFICATION'
  | 'FREE_NOTIFICATION'
  | 'SERVICE_INQUIRY_NOTIFICATION'
  | 'SERVICE_INQUIRY_REPLY_NOTIFICATION'
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
