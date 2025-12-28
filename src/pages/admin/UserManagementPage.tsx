import { AdminLayout } from '@/components/admin';
import { useAdminUsers, useAdminUserStats } from '@/hooks/admin';
import { useState } from 'react';
import { AdminUser } from '@/types/admin';

export const UserManagementPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, isLoading, error } = useAdminUsers({ page, size });
  const { data: stats } = useAdminUserStats();

  const handleLogout = () => {
    console.log('로그아웃');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <span className="inline-flex items-center px-2 py-1 rounded text-label-300-heavy bg-bg-success-weak text-text-success-default">
        활성
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded text-label-300-heavy bg-bg-highlight-disabled text-text-disabled">
        비활성
      </span>
    );
  };

  const totalPages = data ? Math.ceil(data.totalElements / size) : 0;

  return (
    <AdminLayout userName="관리자" onLogout={handleLogout} defaultActiveMenu="users">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-headline-100-heavy text-text-default">사용자 관리</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-200-medium text-text-weak mb-1">전체 사용자</p>
                <p className="text-headline-200-heavy text-text-default">
                  {stats?.totalSubscribers?.toLocaleString() || 0}
                  <span className="text-body-200-medium text-text-weak ml-1">명</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-bg-brand-weak rounded-full flex items-center justify-center">
                <span className="text-headline-300-heavy text-text-brand-default">👥</span>
              </div>
            </div>
          </div>

          {/* Male Users */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-200-medium text-text-weak mb-1">남성 사용자</p>
                <p className="text-headline-200-heavy text-text-default">
                  {stats?.maleSubscribers?.toLocaleString() || 0}
                  <span className="text-body-200-medium text-text-weak ml-1">명</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-headline-300-heavy text-blue-600">👨</span>
              </div>
            </div>
          </div>

          {/* Female Users */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-200-medium text-text-weak mb-1">여성 사용자</p>
                <p className="text-headline-200-heavy text-text-default">
                  {stats?.femaleSubscribers?.toLocaleString() || 0}
                  <span className="text-body-200-medium text-text-weak ml-1">명</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-headline-300-heavy text-pink-600">👩</span>
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white rounded-lg shadow-default overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-border-brand-default border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-body-200-medium text-text-weak">사용자 목록을 불러오는 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <p className="text-body-200-medium text-text-danger-default">사용자 목록을 불러오는데 실패했습니다.</p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && data && (
            <>
              <table className="w-full">
                <thead className="bg-bg-medium border-b border-border-weak2">
                  <tr>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">사용자 ID</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">이메일</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">사용자명</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">성별</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">가입일</th>
                    <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subscribers.map((user: AdminUser) => (
                    <tr
                      key={user.userId}
                      className="border-b border-border-weak2 hover:bg-bg-highlight-hover transition-colors"
                    >
                      <td className="px-6 py-4 text-body-200-medium text-text-default">{user.userId}</td>
                      <td className="px-6 py-4 text-body-200-medium text-text-default">{user.email}</td>
                      <td className="px-6 py-4 text-body-200-medium text-text-default">{user.username}</td>
                      <td className="px-6 py-4 text-body-200-medium text-text-default">
                        {user.gender === 'M' ? '남성' : '여성'}
                      </td>
                      <td className="px-6 py-4 text-body-200-medium text-text-weak">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4">{getStatusBadge(user.active)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-border-weak2">
                <div className="flex items-center gap-2">
                  <span className="text-body-200-medium text-text-weak">페이지당 표시:</span>
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(0);
                    }}
                    className="px-3 py-1 border border-border-default rounded text-body-200-medium"
                  >
                    <option value={10}>10개</option>
                    <option value={25}>25개</option>
                    <option value={50}>50개</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 text-body-200-medium text-text-default border border-border-default rounded hover:bg-bg-highlight-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="px-4 text-body-200-medium text-text-default">
                    {page + 1} / {totalPages || 1}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 text-body-200-medium text-text-default border border-border-default rounded hover:bg-bg-highlight-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
