import { useNavigate, useSearchParams } from 'react-router-dom';

import { Topbar } from '@/components/shared';
import { BlogDetail, QnaDetail } from '@/components/community';

export const CommunityDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const currentTab = searchParams.get('tab') || 'Curated blog';
  console.log('currentTab: ', currentTab);

  return (
    <main className="relative min-h-screen pb-24 font-roboto">
      {/* 공유하기 기능 제작해야함 */}
      <Topbar title="" type="back" onBack={handleBack} />

      {currentTab === 'User blog' && <BlogDetail />}
      {currentTab === 'Q&A' && <QnaDetail />}
    </main>
  );
};
