import { Navbar } from '@/components/shared/navbar/Navbar';
import { Link, useSearchParams } from 'react-router-dom';

import { Tab } from '@/components/community/tab';

import { BlogList, FloatPostAction } from '@/components';
import { QnaList } from '@/components/community';
import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';

export const CommunityPage = () => {
  const [searchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'Curated blog';

  const contentType = currentTab === 'User blog' ? 'blog' : 'qna';
  const { handleLike: listHandleLike, handleBookmark: listHandleBookmark } = useContentActions({
    contentType,
  });

  const { handleLike: featuredHandleLike, handleBookmark: featuredHandleBookmark } = useContentActions({
    contentType: 'blog',
  });

  const { data: featuredBlog } = useFeaturedBlogs();

  return (
    <>
      <Navbar withSearch />
      <div>
        {featuredBlog && (
          <SwiperList
            cards={featuredBlog.data.results}
            onLike={featuredHandleLike}
            onBookmark={featuredHandleBookmark}
          />
        )}
        <Tab />
      </div>
      <Link to="/community/post" className="fixed right-4 bottom-[92px] cursor-pointer sm:right-[calc(50%-260px-16px)]">
        <FloatPostAction />
      </Link>
      {currentTab === 'User blog' && <BlogList onLike={listHandleLike} onBookmark={listHandleBookmark} />}
      {currentTab === 'Q&A' && <QnaList onLike={listHandleLike} onBookmark={listHandleBookmark} />}
    </>
  );
};
