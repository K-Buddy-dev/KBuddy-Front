import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import { DetailTopbar } from '@/components/shared';
import { BlogDetail, QnaDetail } from '@/components/community';
import { useBlogDetail, useContentActions, useQnaDetail, useRecommendedBlogs, useRecommendedQnas } from '@/hooks';
import { Spinner } from '@/components/shared/spinner';
import { DetailModal } from '@/components/community/detail';

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const contentId = Number(id);
  const [searchParams] = useSearchParams();
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const currentTab = searchParams.get('tab') || 'Curated blog';
  const isBlogTab = currentTab === 'User blog';

  const { data: blog, isLoading: blogLoading } = useBlogDetail(isBlogTab ? contentId : null);
  const { data: qna, isLoading: qnaLoading } = useQnaDetail(!isBlogTab ? contentId : null);

  const currentData = currentTab === 'User blog' ? blog?.data : qna?.data;

  const isBookmarked = currentData?.isBookmarked || false;

  const categoryCode = currentData
    ? Array.isArray(currentData.categoryId)
      ? currentData.categoryId[0]
      : currentData.categoryId
    : undefined;

  const { data: recommendBlog, refetch: refetchRecommendedBlog } = useRecommendedBlogs({
    size: 6,
    categoryCode: currentTab === 'User blog' ? categoryCode : undefined,
  });

  const { data: recommendQna, refetch: refetchRecommendedQna } = useRecommendedQnas({
    size: 6,
    categoryCode: currentTab === 'Q&A' ? categoryCode : undefined,
  });

  const contentType = currentTab === 'User blog' ? 'blog' : 'qna';
  const { handleLike, handleBookmark } = useContentActions({
    contentType,
    refetchRecommended: contentType === 'blog' ? refetchRecommendedBlog : refetchRecommendedQna,
  });

  const handleBack = () => {
    window.history.back();
  };

  const isLoading = isBlogTab ? blogLoading : qnaLoading;

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (!currentData) return <div className="w-screen h-screen flex items-center justify-center">No data found</div>;

  return (
    <main className="relative min-h-screen pb-24 font-roboto">
      <DetailTopbar
        title={currentData.title}
        type="back"
        onBack={handleBack}
        isBookmarked={isBookmarked}
        showDetailModal={showDetailModal}
        onBookmark={(e: React.MouseEvent) => handleBookmark(e, contentId, isBookmarked)}
        setShowDetailModal={setShowDetailModal}
      />

      {currentTab === 'User blog' && (
        <BlogDetail
          contentId={contentId}
          onLike={handleLike}
          onBookmark={handleBookmark}
          recommendedData={recommendBlog?.data.results.filter((data: any) => data.id !== contentId)}
        />
      )}
      {currentTab === 'Q&A' && (
        <QnaDetail
          contentId={contentId}
          onLike={handleLike}
          onBookmark={handleBookmark}
          recommendedData={recommendQna?.data.results.filter((data: any) => data.id !== contentId)}
        />
      )}
      {showDetailModal && (
        <DetailModal
          writerId={currentData.writerId}
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
        />
      )}
    </main>
  );
};
