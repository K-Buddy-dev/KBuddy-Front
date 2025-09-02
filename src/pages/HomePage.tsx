import { Navbar } from '@/components/shared/navbar/Navbar';
import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';
import { useEffect, useRef } from 'react';
import { authService } from '@/services';
import { useSendFcmToken } from '@/hooks/useFcmToken';

export const HomePage = () => {
  const { data: featuredBlog, refetch: refetchFeaturedBlog } = useFeaturedBlogs();
  // FCM 토큰 요청 (중복 방지)
  const tokenRequested = useRef(false);

  const { handleLike: featuredHandleLike, handleBookmark: featuredHandleBookmark } = useContentActions({
    contentType: 'blog',
    refetchRecommended: refetchFeaturedBlog,
  });
  const { mutate: sendFcmToken } = useSendFcmToken();

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
          console.log('Received FCM Token:', message.token);
          // FCM 토큰을 localStorage에 저장
          localStorage.setItem('fcmToken', message.token);

          sendFcmToken({
            token: message.token,
            title: '알림 설정 완료',
            body: 'FCM 토큰이 등록되었습니다.(테스트)',
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
