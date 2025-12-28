import { AdminLayout } from '@/components/admin';

export const AdminDashboardPage = () => {
  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃');
  };

  return (
    <AdminLayout userName="관리자" onLogout={handleLogout} defaultActiveMenu="dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-headline-100-heavy text-text-default">대시보드</h1>
          <p className="text-body-200-medium text-text-weak mt-2">관리자 대시보드에 오신 것을 환영합니다</p>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-label-200-medium text-text-weak">총 사용자</h4>
              <div className="w-10 h-10 bg-bg-brand-weak rounded-lg flex items-center justify-center">
                <span className="text-text-brand-default text-title-200-heavy">👥</span>
              </div>
            </div>
            <p className="text-headline-100-heavy text-text-default mb-2">임시</p>
            <div className="flex items-center gap-1">
              <span className="text-label-300-medium text-text-success-default">+12.5%</span>
              <span className="text-label-300-light text-text-weak">임시</span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-label-200-medium text-text-weak">총 게시글</h4>
              <div className="w-10 h-10 bg-bg-success-weak rounded-lg flex items-center justify-center">
                <span className="text-text-success-default text-title-200-heavy">📝</span>
              </div>
            </div>
            <p className="text-headline-100-heavy text-text-default mb-2">임시</p>
            <div className="flex items-center gap-1">
              <span className="text-label-300-medium text-text-success-default">+8.3%</span>
              <span className="text-label-300-light text-text-weak">임시</span>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-label-200-medium text-text-weak">총 댓글</h4>
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
                <span className="text-[#3B82F6] text-title-200-heavy">💬</span>
              </div>
            </div>
            <p className="text-headline-100-heavy text-text-default mb-2">임시</p>
            <div className="flex items-center gap-1">
              <span className="text-label-300-medium text-text-success-default">+15.7%</span>
              <span className="text-label-300-light text-text-weak">지난 달 대비</span>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-lg shadow-default p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-label-200-medium text-text-weak">임시</h4>
              <div className="w-10 h-10 bg-bg-danger-weak rounded-lg flex items-center justify-center">
                <span className="text-text-danger-default text-title-200-heavy">⚠️</span>
              </div>
            </div>
            <p className="text-headline-100-heavy text-text-default mb-2">23</p>
            <div className="flex items-center gap-1">
              <span className="text-label-300-medium text-text-danger-default">-5.2%</span>
              <span className="text-label-300-light text-text-weak">지난 달 대비</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-default p-6">
          <h3 className="text-title-200-heavy text-text-default mb-4">최근 활동</h3>
          <p className="text-body-200-medium text-text-weak">최근 활동 내역이 여기에 표시됩니다. (구현 예정)</p>
        </div>
      </div>
    </AdminLayout>
  );
};
