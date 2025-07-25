import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { DetailTopbar } from '@/components/shared';
import { BlogDetail, QnaDetail } from '@/components/community';
import {
  useBlogDetail,
  useContentActions,
  useDeleteBlog,
  useDeleteQna,
  useQnaDetail,
  useRecommendedBlogs,
  useRecommendedQnas,
} from '@/hooks';
import { Spinner } from '@/components/shared/spinner';
import { DetailModal } from '@/components/community/detail';
import { useToast } from '@/hooks/useToastContext';
import { PostFormType } from '@/types';

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const contentId = Number(id);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const { showToast } = useToast();

  const currentTab = searchParams.get('tab') || 'Curated blog';
  const isBlogTab = currentTab === 'User blog';
  const targetTab: PostFormType = isBlogTab ? 'Blog' : 'Q&A';

  const { data: blog, isLoading: blogLoading } = useBlogDetail(isBlogTab ? contentId : null);
  const { data: qna, isLoading: qnaLoading } = useQnaDetail(!isBlogTab ? contentId : null);
  const { mutate: deleteBlog, isSuccess: isBlogDeleteSuccess } = useDeleteBlog();
  const { mutate: deleteQna, isSuccess: isQnaDeleteSuccess } = useDeleteQna();

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

  useEffect(() => {
    if (isBlogDeleteSuccess || isQnaDeleteSuccess) {
      setShowDetailModal(false);
      showToast({
        message: 'Successfully deleted this blog',
        type: 'success',
        duration: 3000,
      });
    }
  }, [isBlogDeleteSuccess, isQnaDeleteSuccess, isBlogTab, navigate, showToast]);

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (!currentData) return <div className="w-full h-screen flex items-center justify-center">No data found</div>;

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
          content={currentData}
          contentId={currentData.id}
          writerUuid={currentData.writerUuid}
          targetTab={targetTab}
          deleteMutate={isBlogTab ? deleteBlog : deleteQna}
          setShowDetailModal={setShowDetailModal}
        />
      )}
    </main>
  );
};
