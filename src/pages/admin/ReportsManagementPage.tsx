import { AdminLayout } from '@/components/admin';
import { useAdminPostReports, useAdminUserReports } from '@/hooks/admin';
import { useState } from 'react';
import { PostReport, UserReport } from '@/types/admin';

type TabType = 'posts' | 'users';

export const ReportsManagementPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const { data: postReportsData, isLoading: isLoadingPosts } = useAdminPostReports();
  const { data: userReportsData, isLoading: isLoadingUsers } = useAdminUserReports();

  const handleLogout = () => {
    console.log('로그아웃');
  };

  const getPostTypeBadge = (type: 'BLOG' | 'COMMUNITY') => {
    return type === 'BLOG' ? (
      <span className="inline-flex items-center px-2 py-1 rounded text-label-300-heavy bg-purple-100 text-purple-700">
        블로그
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded text-label-300-heavy bg-green-100 text-green-700">
        커뮤니티
      </span>
    );
  };

  return (
    <AdminLayout userName="관리자" onLogout={handleLogout} defaultActiveMenu="reports">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-headline-100-heavy text-text-default">신고 관리</h1>
          <p className="text-body-200-medium text-text-weak mt-2">신고된 게시글과 사용자를 관리합니다</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border-weak2">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-2 text-body-100-medium border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-border-brand-default text-text-brand-default'
                  : 'border-transparent text-text-weak hover:text-text-default'
              }`}
            >
              게시글 신고
              {postReportsData && (
                <span className="ml-2 px-2 py-0.5 bg-bg-danger-weak text-text-danger-default rounded-full text-label-300-heavy">
                  {postReportsData.totalPosts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-2 text-body-100-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-border-brand-default text-text-brand-default'
                  : 'border-transparent text-text-weak hover:text-text-default'
              }`}
            >
              사용자 신고
              {userReportsData && (
                <span className="ml-2 px-2 py-0.5 bg-bg-danger-weak text-text-danger-default rounded-full text-label-300-heavy">
                  {userReportsData.totalUsers}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Post Reports Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow-default overflow-hidden">
            {isLoadingPosts && (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-border-brand-default border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-body-200-medium text-text-weak">게시글 신고 목록을 불러오는 중...</p>
              </div>
            )}

            {!isLoadingPosts && postReportsData && (
              <>
                <table className="w-full">
                  <thead className="bg-bg-medium border-b border-border-weak2">
                    <tr>
                      <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">게시글 ID</th>
                      <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">타입</th>
                      <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">제목</th>
                      <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">작성자</th>
                      <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">이메일</th>
                      <th className="px-6 py-3 text-left text-label-200-medium text-text-weak">신고 횟수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postReportsData.posts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-body-200-medium text-text-weak">
                          신고된 게시글이 없습니다
                        </td>
                      </tr>
                    ) : (
                      postReportsData.posts.map((post: PostReport) => (
                        <tr
                          key={post.postId}
                          className="border-b border-border-weak2 hover:bg-bg-highlight-hover transition-colors"
                        >
                          <td className="px-6 py-4 text-body-200-medium text-text-default">{post.postId}</td>
                          <td className="px-6 py-4">{getPostTypeBadge(post.postType)}</td>
                          <td className="px-6 py-4 text-body-200-medium text-text-default max-w-xs truncate">
                            {post.title}
                          </td>
                          <td className="px-6 py-4 text-body-200-medium text-text-default">{post.writerUsername}</td>
                          <td className="px-6 py-4 text-body-200-medium text-text-weak">{post.writerEmail}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-label-300-heavy bg-bg-danger-weak text-text-danger-default">
                              {post.reportCount}회
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* User Reports Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-default overflow-hidden">
            {isLoadingUsers && (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-border-brand-default border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-body-200-medium text-text-weak">사용자 신고 목록을 불러오는 중...</p>
              </div>
            )}

            {!isLoadingUsers && userReportsData && (
              <div className="divide-y divide-border-weak2">
                {userReportsData.users.length === 0 ? (
                  <div className="px-6 py-8 text-center text-body-200-medium text-text-weak">
                    신고된 사용자가 없습니다
                  </div>
                ) : (
                  userReportsData.users.map((user: UserReport) => (
                    <div key={user.userId} className="p-6 hover:bg-bg-highlight-hover transition-colors">
                      {/* User Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-body-100-heavy text-text-default">{user.username}</h3>
                            <span className="text-body-200-medium text-text-weak">{user.email}</span>
                          </div>
                          <p className="text-body-200-medium text-text-weak mt-1">사용자 ID: {user.userId}</p>
                        </div>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-label-200-heavy bg-bg-danger-weak text-text-danger-default">
                          총 {user.totalReports}회 신고됨
                        </span>
                      </div>

                      {/* User's Reported Posts */}
                      {user.posts.length > 0 && (
                        <div className="mt-4 bg-bg-medium rounded-lg p-4">
                          <h4 className="text-label-200-medium text-text-weak mb-3">신고된 게시글</h4>
                          <div className="space-y-2">
                            {user.posts.map((post: PostReport) => (
                              <div
                                key={post.postId}
                                className="flex items-center justify-between bg-white p-3 rounded border border-border-weak2"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {getPostTypeBadge(post.postType)}
                                  <span className="text-body-200-medium text-text-default truncate">{post.title}</span>
                                </div>
                                <span className="text-label-300-heavy text-text-danger-default ml-3">
                                  {post.reportCount}회
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
