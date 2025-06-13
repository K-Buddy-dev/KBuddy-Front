import { Navbar } from '@/components/shared/navbar/Navbar';

import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';
import { useEffect } from 'react';
import { userService } from '@/services';

export const HomePage = () => {
  const { data: featuredBlog, refetch: refetchFeaturedBlog } = useFeaturedBlogs();

  const { handleLike: featuredHandleLike, handleBookmark: featuredHandleBookmark } = useContentActions({
    contentType: 'blog',
    refetchRecommended: refetchFeaturedBlog,
  });

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await userService.getUserProfile();
        const basicUserData = response.data;
        localStorage.setItem('basicUserData', JSON.stringify(basicUserData));
      } catch (error) {
        console.error(error);
      }
    };

    getUserProfile();
  }, []);

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
