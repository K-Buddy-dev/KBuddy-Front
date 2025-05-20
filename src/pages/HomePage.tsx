import { Navbar } from '@/components/shared/navbar/Navbar';

import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';

export const HomePage = () => {
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
      </div>
    </>
  );
};
