import { Navbar } from '@/components/shared/navbar/Navbar';
import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';
import { useEffect, useRef } from 'react';
import { authService } from '@/services';
import { useSendFcmTokenToServer } from '@/hooks/useFcmToken';

export const HomePage = () => {
  const { data: featuredBlog, refetch: refetchFeaturedBlog } = useFeaturedBlogs();
  // FCM 토큰 요청 (중복 방지)
  const tokenRequested = useRef(false);

  const { handleLike: featuredHandleLike, handleBookmark: featuredHandleBookmark } = useContentActions({
    contentType: 'blog',
    refetchRecommended: refetchFeaturedBlog,
  });

  const { mutate: sendFcmTokenToServer } = useSendFcmTokenToServer();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        const basicUserData = response.data;
        localStorage.setItem('basicUserData', JSON.stringify(basicUserData));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ReactNativeWebView && !tokenRequested.current) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'requestFcmToken' }));
      tokenRequested.current = true;
    }
  }, []);

  // FCM 토큰 수신 및 API 호출
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'fcmTokenReady' && message.token) {
          localStorage.setItem('fcmToken', message.token);
          sendFcmTokenToServer({
            token: message.token,
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
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
