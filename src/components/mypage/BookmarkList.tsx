import { useNavigate } from 'react-router-dom';
import { useBookmarkBlogs } from '@/hooks';
import { CommunityCard } from '../community';
import { SkeletonCard } from '../community';
import { formatDate } from '@/utils';
import { useContentActions } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

export const BookmarkList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useBookmarkBlogs();

  const refetchBookmarks = () => {
    queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
  };

  const blogActions = useContentActions({ contentType: 'blog', refetchRecommended: refetchBookmarks });
  const qnaActions = useContentActions({ contentType: 'qna', refetchRecommended: refetchBookmarks });

  const handleDetail = (item: any) => {
    sessionStorage.setItem('scrollY', String(window.scrollY));
    const tab = item.postType === 'BLOG' ? 'Userblog' : 'Q&A';
    navigate(`/community/detail/${item.id}?tab=${encodeURIComponent(tab)}`);
  };

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  if (!data || data.data.length === 0) {
    return (
      <section className="mx-4 rounded-lg bg-bg-medium px-4 py-5 text-center font-roboto text-text-default">
        <p className="text-[14px] font-medium leading-5">There aren&apos;t any saved posts yet.</p>
        <p className="mt-1 text-[12px] font-normal leading-4 text-text-weak">
          Save posts you want to revisit, and they will appear here.
        </p>
      </section>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {data.data.map((item) => {
        const isBlog = item.postType === 'BLOG';
        const { handleLike, handleBookmark } = isBlog ? blogActions : qnaActions;

        return (
          <div
            className="bg-white border-y-[2px] border-b-0 border-border-weak2 cursor-pointer"
            key={item.id}
            onClick={() => handleDetail(item)}
          >
            <CommunityCard
              writerUuid={item.writerUuid}
              writerName={item.writerName}
              writerProfileImageUrl={item.writerProfileImageUrl}
              thumbnailImageUrl={item.thumbnailImageUrl}
              createdAt={formatDate(item.createdAt)}
              title={item.title}
              categoryId={item.categoryId}
              heartCount={item.heartCount}
              comments={item.commentCount}
              isBookmarked={item.isBookmarked}
              isHearted={item.isHearted}
              onLike={(e) => {
                e.stopPropagation();
                handleLike(e, item.id, item.isHearted);
              }}
              onBookmark={(e) => {
                e.stopPropagation();
                handleBookmark(e, item.id, item.isBookmarked);
              }}
            />
          </div>
        );
      })}
      <div className="h-[136px]"></div>
    </div>
  );
};
