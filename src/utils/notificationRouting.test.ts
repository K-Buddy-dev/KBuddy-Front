import { getNotificationTargetPath } from './notificationRouting';

it.each([
  ['BOOKING_REQUEST_NOTIFICATION', '456', '/profile/bookings/456'],
  ['BOOKING_CANCELLED_NOTIFICATION', '456', '/profile/bookings/456'],
  ['CHAT_MESSAGE_NOTIFICATION', 'room-1', '/message/room-1'],
  ['INQUIRY_NOTIFICATION', 'service-1', '/service/service-1?tab=Inquiry'],
  ['INQUIRY_REPLY_NOTIFICATION', 'service-1', '/service/service-1?tab=Inquiry'],
  ['SERVICE_INQUIRY_NOTIFICATION', 'service-1', '/service/service-1?tab=Inquiry'],
  ['SERVICE_INQUIRY_REPLY_NOTIFICATION', 'service-1', '/service/service-1?tab=Inquiry'],
  ['BLOG_LIKE_NOTIFICATION', '12', '/community/detail/12?tab=Userblog'],
  ['BLOG_COMMENT_NOTIFICATION', '12', '/community/detail/12?tab=Userblog'],
  ['BLOG_COMMENT_LIKE_NOTIFICATION', '12', '/community/detail/12?tab=Userblog'],
  ['QNA_LIKE_NOTIFICATION', '34', '/community/detail/34?tab=Q%26A'],
  ['QNA_COMMENT_NOTIFICATION', '34', '/community/detail/34?tab=Q%26A'],
  ['QNA_COMMENT_LIKE_NOTIFICATION', '34', '/community/detail/34?tab=Q%26A'],
  ['FREE_NOTIFICATION', '/service', '/service'],
])('routes %s notifications', (type, targetId, expectedPath) => {
  expect(getNotificationTargetPath({ targetId, type })).toBe(expectedPath);
});

it('returns null when targetId is missing or an unknown notification type is received', () => {
  expect(getNotificationTargetPath({ targetId: '', type: 'BOOKING_REQUEST_NOTIFICATION' })).toBeNull();
  expect(getNotificationTargetPath({ targetId: '1', type: 'UNKNOWN_NOTIFICATION' })).toBeNull();
});
