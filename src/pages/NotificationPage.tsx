import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/shared/navbar/Navbar';
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/types/notification';
import { getNotificationTargetPath } from '@/utils/notificationRouting';
import { cn } from '@/utils/utils';
import { AlarmIcon } from '@/components/shared/icon';

export function NotificationPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const notifications = data?.content ?? [];
  const hasUnread = notifications.some((notification) => !notification.isRead);
  const shouldShowIntro = isLoading || isError || notifications.length === 0;

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead.mutateAsync(notification.id);
    }

    const targetPath = getNotificationTargetPath(notification);
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleReadAll = async () => {
    await markAllAsRead.mutateAsync();
  };

  return (
    <>
      <Navbar withSearch={false} />
      <main className="pb-24">
        {shouldShowIntro && (
          <header data-testid="notification-page-intro" className="flex items-center justify-between px-4 py-5">
            <div>
              <h1 className="text-title-100-heavy font-bold text-text-default">Notifications</h1>
              <p className="mt-1 text-body-200-medium text-text-weak">Stay updated on messages and bookings.</p>
            </div>
            {hasUnread && (
              <button
                type="button"
                className="text-button-200-regular font-semibold text-text-brand-default"
                onClick={handleReadAll}
              >
                Mark all read
              </button>
            )}
          </header>
        )}

        {!shouldShowIntro && hasUnread && (
          <div className="flex justify-end px-4 py-3">
            <button
              type="button"
              className="text-button-200-regular font-semibold text-text-brand-default"
              onClick={handleReadAll}
            >
              Mark all read
            </button>
          </div>
        )}
        {isLoading && (
          <div className="flex h-64 items-center justify-center text-text-weak">Loading notifications...</div>
        )}

        {isError && (
          <div className="flex h-64 items-center justify-center px-6 text-center text-text-weak">
            {error?.message || 'Could not load notifications.'}
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && <EmptyNotificationState />}

        {!isLoading && !isError && notifications.length > 0 && (
          <ul className="divide-y divide-border-weak2">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  className="flex w-full gap-3 px-4 py-4 text-left hover:bg-bg-highlight-hover"
                  aria-label={`${notification.title}: ${notification.message}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span
                    className={cn(
                      'mt-2 h-2.5 w-2.5 shrink-0 rounded-full',
                      notification.isRead ? 'bg-border-weak1' : 'bg-bg-brand-default'
                    )}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-body-100-heavy font-semibold text-text-default">{notification.title}</span>
                      <span className="shrink-0 text-label-300-light text-text-weak">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </span>
                    <span className="mt-1 block text-body-200-medium text-text-weak">{notification.message}</span>
                    {!notification.isRead && (
                      <span className="mt-2 inline-flex rounded-full bg-bg-brand-weak px-2 py-0.5 text-label-300-heavy font-semibold text-text-brand-default">
                        Unread
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

function EmptyNotificationState() {
  return (
    <section className="flex min-h-[420px] items-center justify-center px-6 py-10 text-center">
      <div className="flex max-w-[360px] flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-bg-brand-weak">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-brand-default shadow-default">
            <AlarmIcon color="#FFFFFF" />
          </div>
          <span className="absolute right-5 top-5 h-3 w-3 rounded-full bg-bg-success-default" aria-hidden="true" />
        </div>

        <h2 className="mt-6 text-title-200-heavy font-bold text-text-default">You are all caught up</h2>
        <p className="mt-2 text-body-200-medium leading-6 text-text-weak">
          New messages, booking updates, and counselor replies will appear here.
        </p>

        <div className="mt-6 flex w-full flex-col gap-2 rounded-lg bg-bg-highlight-selected p-4 text-left">
          <div className="flex items-center justify-between text-body-200-medium">
            <span className="text-text-default">Live chat requests</span>
            <span className="text-text-weak">Ready</span>
          </div>
          <div className="flex items-center justify-between text-body-200-medium">
            <span className="text-text-default">Booking updates</span>
            <span className="text-text-weak">Ready</span>
          </div>
          <div className="flex items-center justify-between text-body-200-medium">
            <span className="text-text-default">Counselor replies</span>
            <span className="text-text-weak">Ready</span>
          </div>
        </div>

        <Link
          to="/service"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-bg-brand-default px-5 text-button-200-regular font-semibold text-white"
        >
          Explore services
        </Link>
      </div>
    </section>
  );
}

function formatNotificationTime(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '';

  const isSameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    ...(isSameYear ? {} : { year: 'numeric' }),
  }).format(date);
}
