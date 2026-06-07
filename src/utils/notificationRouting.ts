type NotificationRouteInput = {
  targetId?: string | null;
  type?: string | null;
};

const USER_BLOG_TAB = 'Userblog';
const QNA_TAB = 'Q&A';

export const getNotificationTargetPath = ({ targetId, type }: NotificationRouteInput) => {
  if (!targetId || !type) return null;

  if (targetId.startsWith('/')) {
    return targetId;
  }

  if (type === 'CHAT_MESSAGE_NOTIFICATION') {
    return `/message/${targetId}`;
  }

  if (type === 'BOOKING_REQUEST_NOTIFICATION' || type === 'BOOKING_CANCELLED_NOTIFICATION') {
    return `/profile/bookings/${targetId}`;
  }

  if (type === 'INQUIRY_NOTIFICATION' || type === 'INQUIRY_REPLY_NOTIFICATION') {
    return `/service/${targetId}?tab=Inquiry`;
  }

  if (type === 'BLOG_LIKE_NOTIFICATION' || type === 'BLOG_COMMENT_NOTIFICATION') {
    return `/community/detail/${targetId}?tab=${encodeURIComponent(USER_BLOG_TAB)}`;
  }

  if (type === 'QNA_LIKE_NOTIFICATION' || type === 'QNA_COMMENT_NOTIFICATION') {
    return `/community/detail/${targetId}?tab=${encodeURIComponent(QNA_TAB)}`;
  }

  return null;
};
