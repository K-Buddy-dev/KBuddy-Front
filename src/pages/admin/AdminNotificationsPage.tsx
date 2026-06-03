import { FormEvent, useState } from 'react';
import { AdminLayout } from '@/components/admin';
import { adminService } from '@/services/adminService';

export const AdminNotificationsPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = () => {
    console.log('로그아웃');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();
    const trimmedTargetId = targetId.trim();

    if (!trimmedTitle || !trimmedMessage) {
      setErrorMessage('Title and message are required.');
      setResultMessage('');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setResultMessage('');

    try {
      const result = await adminService.sendNotification({
        message: trimmedMessage,
        targetId: trimmedTargetId || null,
        title: trimmedTitle,
      });
      setResultMessage(`Notification sent to ${result.sentCount.toLocaleString()} users.`);
      setTitle('');
      setMessage('');
      setTargetId('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to send notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout userName="관리자" onLogout={handleLogout} defaultActiveMenu="notifications">
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-100-heavy text-text-default">알림 발송</h1>
          <p className="text-body-200-medium text-text-weak mt-2">
            전체 사용자에게 FREE_NOTIFICATION 타입의 공지 알림을 발송합니다.
          </p>
        </div>

        <form className="max-w-2xl rounded-lg bg-white p-6 shadow-default" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-body-200-heavy font-semibold text-text-default">Title</span>
              <input
                className="w-full rounded border border-border-default px-3 py-2 text-body-200-medium outline-none focus:border-border-brand"
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-body-200-heavy font-semibold text-text-default">Message</span>
              <textarea
                className="min-h-[120px] w-full rounded border border-border-default px-3 py-2 text-body-200-medium outline-none focus:border-border-brand"
                maxLength={500}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-body-200-heavy font-semibold text-text-default">Target path or ID</span>
              <input
                className="w-full rounded border border-border-default px-3 py-2 text-body-200-medium outline-none focus:border-border-brand"
                placeholder="/service, /community/detail/1, or empty"
                value={targetId}
                onChange={(event) => setTargetId(event.target.value)}
              />
            </label>

            {errorMessage && <p className="text-body-200-medium text-text-danger-default">{errorMessage}</p>}
            {resultMessage && <p className="text-body-200-medium text-text-success-default">{resultMessage}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-bg-brand-default px-5 py-2 text-button-200-regular font-semibold text-white disabled:bg-bg-disabled"
              >
                {isSubmitting ? 'Sending...' : 'Send notification'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
