import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

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
import { useBlockUser } from '@/hooks/useBlockUser';
import { BlockUserModal } from '@/components/community/detail/BlockModal';

const TAB = {
  CURATED_BLOG: 'Curatedblog',
  USER_BLOG: 'Userblog',
  QNA: 'Q&A',
} as const;
type TabKey = (typeof TAB)[keyof typeof TAB];

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentId = Number(id);
  const [searchParams] = useSearchParams();
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showBlockUserModal, setShowBlockUserModal] = useState<boolean>(false);
  const { showToast } = useToast();

  // URL 쿼리의 탭값. 기본을 큐레이티드로 두되, 상세는 블로그 계열과 Q&A로만 분기
  const tabParam = (searchParams.get('tab') as TabKey) ?? TAB.CURATED_BLOG;

  // 블로그 계열(큐레이티드/유저블로그) 묶기
  const isBlogLikeTab = tabParam === TAB.USER_BLOG || tabParam === TAB.CURATED_BLOG;
  const isQnaTab = tabParam === TAB.QNA;

  // 상세 데이터 훅: 현재 탭에 해당하는 것만 활성화
  const { data: blog, isLoading: blogLoading } = useBlogDetail(isBlogLikeTab ? contentId : null);
  const { data: qna, isLoading: qnaLoading } = useQnaDetail(isQnaTab ? contentId : null);

  // 삭제/차단 훅
  const { mutate: deleteBlog, isSuccess: isBlogDeleteSuccess } = useDeleteBlog();
  const { mutate: deleteQna, isSuccess: isQnaDeleteSuccess } = useDeleteQna();
  const blockMutate = useBlockUser();

  // 현재 탭의 데이터/로딩 상태
  const currentData = useMemo(() => (isBlogLikeTab ? blog?.data : qna?.data), [blog?.data, qna?.data, isBlogLikeTab]);
  const isLoading = isBlogLikeTab ? blogLoading : qnaLoading;

  const isBookmarked = currentData?.isBookmarked || false;

  const categoryCode = currentData
    ? Array.isArray(currentData.categoryId)
      ? currentData.categoryId[0]
      : currentData.categoryId
    : undefined;

  // 추천 데이터
  const { data: recommendBlog, refetch: refetchRecommendedBlog } = useRecommendedBlogs({
    size: 6,
    categoryCode: isBlogLikeTab ? categoryCode : undefined,
  });
  const { data: recommendQna, refetch: refetchRecommendedQna } = useRecommendedQnas({
    size: 6,
    categoryCode: isQnaTab ? categoryCode : undefined,
  });

  // 액션 훅
  const contentType = isBlogLikeTab ? 'blog' : 'qna';
  const { handleLike, handleBookmark } = useContentActions({
    contentType,
    refetchRecommended: isBlogLikeTab ? refetchRecommendedBlog : refetchRecommendedQna,
  });

  const handleBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home', { replace: true });
    }
  };

  const handleBlockUserOpen = () => {
    setShowBlockUserModal(true);
  };

  // 삭제 성공 시 처리 (탭에 맞춰 메시지 분기)
  useEffect(() => {
    if (isBlogDeleteSuccess || isQnaDeleteSuccess) {
      setShowDetailModal(false);
      showToast({
        message: `Successfully deleted this ${isQnaTab ? 'Q&A' : 'blog'}`,
        type: 'success',
        duration: 3000,
      });
    }
  }, [isBlogDeleteSuccess, isQnaDeleteSuccess, isQnaTab, showToast]);

  // 로딩/빈 데이터 분리 (무한 스피너 방지)
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!currentData) {
    return <div className="w-full h-screen flex items-center justify-center">No data found</div>;
  }

  // 상세 모달용 탭 타입
  const targetTab: PostFormType = isQnaTab ? 'Q&A' : 'Blog';

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

      {isBlogLikeTab && (
        <BlogDetail
          contentId={contentId}
          onLike={handleLike}
          onBookmark={handleBookmark}
          recommendedData={recommendBlog?.data?.results?.filter((d: any) => d.id !== contentId)}
          handleBlockUserOpen={handleBlockUserOpen}
        />
      )}

      {isQnaTab && (
        <QnaDetail
          contentId={contentId}
          onLike={handleLike}
          onBookmark={handleBookmark}
          recommendedData={recommendQna?.data?.results?.filter((d: any) => d.id !== contentId)}
          handleBlockUserOpen={handleBlockUserOpen}
        />
      )}

      {showDetailModal && (
        <DetailModal
          content={currentData}
          contentId={currentData.id}
          writerUuid={currentData.writerUuid}
          targetTab={targetTab}
          deleteMutate={isQnaTab ? deleteQna : deleteBlog}
          setShowDetailModal={setShowDetailModal}
        />
      )}

      {showBlockUserModal && (
        <BlockUserModal
          userId={currentData.writerUuid}
          blockMutate={(uid: string) => blockMutate.mutate(uid)}
          setShowBlockUserModal={setShowBlockUserModal}
        />
      )}
    </main>
  );
};
