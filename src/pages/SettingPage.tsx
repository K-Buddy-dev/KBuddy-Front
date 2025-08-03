import { Topbar } from '@/components/shared';
import { authService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      <div className="w-full h-[calc(100vh-79px)] flex flex-col items-center justify-start gap-2 bg-border-weak2 pt-16">
        <div className="w-full flex flex-col gap-2 bg-white px-4">
          <div className="text-title-200-medium leading-6 font-medium pt-6 pb-4">Other</div>
          <div
            className="text-title-300-light leading-6 font-normal py-4 pl-3 border-t border-border-weak1 bg-bg-highlight-default cursor-pointer"
            onClick={onClickDeleteAccount}
          >
            Delete account
          </div>
        </div>
        <div className="w-full bg-white pt-6 px-4 pb-[72px]">
          <p
            className="text-text-default font-semibold leading-4 underline mb-[42px] cursor-pointer"
            onClick={onClickLogout}
          >
            Log out
          </p>
          <span className="text-text-example font-medium leading-3">Version of the app</span>
        </div>
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
