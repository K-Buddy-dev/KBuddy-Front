import { Topbar } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useBlockedUsers, useUnblockUser } from '@/hooks/useBlockUser';
import { Spinner } from '@/components/shared/spinner';

export function BlockUserPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useBlockedUsers();

  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser();

  const handleUnblock = (blockedUserId: number) => {
    unblockUser(String(blockedUserId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Blocked Users" type="back" onBack={() => navigate(-1)} />

      <div className="p-4 mt-[72px]">
        {isError && <p className="text-red-500 text-center py-8">Failed to load the blocked users list.</p>}
        {!isLoading && data && (
          <ul className="space-y-3">
            {data.map((user) => (
              <li key={user.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                <span className="font-medium">{user.blockedUsername}</span>
                <button
                  onClick={() => handleUnblock(user.blockedId)}
                  disabled={isUnblocking}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isUnblocking ? 'Unblocking...' : 'Unblock'}
                </button>
              </li>
            ))}
            {data.length === 0 && <p className="text-center text-gray-500 py-8">No blocked users.</p>}
          </ul>
        )}
      </div>
    </>
  );
}
