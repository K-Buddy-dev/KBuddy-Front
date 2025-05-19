import { useParams, useSearchParams } from 'react-router-dom';

import { DetailTopbar } from '@/components/shared';
import { BlogDetail, QnaDetail } from '@/components/community';
import {
  useAddBlogBookmark,
  useAddBlogHeart,
  useAddQnaBookmark,
  useAddQnaHeart,
  useBlogDetail,
  useQnaDetail,
  useRecommendedBlogs,
  useRecommendedQnas,
  useRemoveBlogBookmark,
  useRemoveBlogHeart,
  useRemoveQnaBookmark,
  useRemoveQnaHeart,
} from '@/hooks';
import { Spinner } from '@/components/shared/spinner';
import { useCallback } from 'react';

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const contentId = Number(id);
  const [searchParams] = useSearchParams();

  const { data: blog, isLoading: blogLoading } = useBlogDetail(contentId);
  const { data: qna, isLoading: qnaLoading } = useQnaDetail(contentId);

  const currentTab = searchParams.get('tab') || 'Curated blog';
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

  // 북마크 관련 훅
  const addBlogBookmark = useAddBlogBookmark();
  const removeBlogBookmark = useRemoveBlogBookmark();
  const addQnaBookmark = useAddQnaBookmark();
  const removeQnaBookmark = useRemoveQnaBookmark();

  // 좋아요 관련 훅
  const addBlogHeart = useAddBlogHeart();
  const removeBlogHeart = useRemoveBlogHeart();
  const addQnaHeart = useAddQnaHeart();
  const removeQnaHeart = useRemoveQnaHeart();

  const handleBookmark = useCallback(
    (contentId: number, isBookmarked: boolean) => {
      if (currentTab === 'User blog') {
        if (isBookmarked) {
          removeBlogBookmark.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedBlog();
            },
            onError: (error) => alert(`Fail remove Bookmark: ${error.message}`),
          });
        } else {
          addBlogBookmark.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedBlog();
            },
            onError: (error) => alert(`Fail add Bookmark: ${error.message}`),
          });
        }
      } else {
        if (isBookmarked) {
          removeQnaBookmark.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedQna();
            },
            onError: (error) => alert(`Fail remove Bookmark: ${error.message}`),
          });
        } else {
          addQnaBookmark.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedQna();
            },
            onError: (error) => alert(`Fail add Bookmark: ${error.message}`),
          });
        }
      }
    },
    [addBlogBookmark, addBlogHeart, removeBlogBookmark, removeBlogHeart]
  );

  const handleLike = useCallback(
    (contentId: number, isHearted: boolean) => {
      if (currentTab === 'User blog') {
        if (isHearted) {
          removeBlogHeart.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedBlog();
            },
            onError: (error) => {
              alert(`Fail remove Like: ${error.message}`);
            },
          });
        } else {
          addBlogHeart.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedBlog();
            },
            onError: (error) => {
              alert(`Fail add Like: ${error.message}`);
            },
          });
        }
      } else {
        if (isHearted) {
          removeQnaHeart.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedQna();
            },
            onError: (error) => {
              alert(`Fail remove Like: ${error.message}`);
            },
          });
        } else {
          addQnaHeart.mutate(contentId, {
            onSuccess: () => {
              refetchRecommendedQna();
            },
            onError: (error) => {
              alert(`Fail add Like: ${error.message}`);
            },
          });
        }
      }
    },
    [addBlogBookmark, addBlogHeart, removeBlogBookmark, removeBlogHeart]
  );

  const handleBack = () => {
    window.history.back();
  };

  if (blogLoading || qnaLoading)
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
        onBookmark={() => handleBookmark(contentId, isBookmarked)}
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
    </main>
  );
};
