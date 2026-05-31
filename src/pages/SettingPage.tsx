import { Topbar } from '@/components/shared';
import { authService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const contactFormUrl = 'https://0ntm7gxvv3y.typeform.com/to/r75u0iEC';

export function SettingPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onClickLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const onClickDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const onClickBlockUserList = () => {
    navigate('/block-user');
  };

  const onClickContactUs = () => {
    window.location.assign(contactFormUrl);
  };

  const handleConfirmDelete = async () => {
    try {
      await authService.deleteAccount();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Topbar title="Settings" type="back" onBack={() => navigate(-1)} />
      <div className="min-h-screen bg-bg-default px-4 pb-24 pt-[72px] text-text-default">
        <SettingsSection title="Account">
          <SettingsRow label="Contact us" onClick={onClickContactUs} />
          <SettingsRow label="Block user list" onClick={onClickBlockUserList} />
          <SettingsRow label="Log out" onClick={onClickLogout} />
        </SettingsSection>

        <SettingsSection title="Danger zone" className="mt-8">
          <SettingsRow danger label="Delete account" onClick={onClickDeleteAccount} />
        </SettingsSection>

        <p className="mt-8 px-1 text-center text-xs font-medium leading-4 text-text-example">Version 1.0.0</p>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <h3 className="text-title-200-medium font-medium mb-4">Delete account</h3>
            <p className="text-body-200-medium text-text-weak mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-3 px-4 border border-border-default rounded-lg text-body-200-medium font-medium hover:bg-bg-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 bg-bg-danger-default text-white rounded-lg text-body-200-medium font-medium hover:bg-bg-danger-hover"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SettingsSection({
  children,
  className = '',
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <section className={className}>
      <h2 className="px-1 pb-3 text-sm font-semibold leading-5 text-text-weak">{title}</h2>
      <div className="overflow-hidden rounded-lg border border-border-weak1 bg-white">{children}</div>
    </section>
  );
}

function SettingsRow({ danger = false, label, onClick }: { danger?: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center justify-between border-b border-border-weak1 px-4 text-left text-base font-normal leading-6 last:border-b-0 ${
        danger ? 'text-text-danger-default' : 'text-text-default'
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      {!danger && (
        <span aria-hidden="true" className="text-text-example">
          ›
        </span>
      )}
    </button>
  );
}
