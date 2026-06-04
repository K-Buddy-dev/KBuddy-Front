import { Navbar } from '@/components/shared/navbar/Navbar';
import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { authService } from '@/services';
import { useSendFcmTokenToServer } from '@/hooks/useFcmToken';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { serviceCategories } from '@/constants/serviceCategories';
import { discoveryItems, type DiscoveryType } from '@/constants/discovery';

type DiscoveryFilter = 'ALL' | DiscoveryType;

const discoveryFilters: DiscoveryFilter[] = ['ALL', 'Events', 'Notice'];

const homeAd = {
  sponsor: 'KKday',
  title: '30-Day Unlimited Data SIM for Korea',
  description: 'Stay connected with unlimited data and local calls for 30 days. Pick up your SIM in Korea.',
  offer: 'KT Olleh rechargeable SIM card for travelers, exchange students, and new arrivals.',
  cta: 'Book on KKday',
  href: 'https://www.kkday.com/ko/product/18137-kt-olleh-30-day-unlimited-data-sim-card-pick-up-delivery-in-korea-south-korea?srsltid=AfmBOopLfnHFOnbXN5QEEfz9g-1x41xDMjYOYcN5gGYJAN_wqdOc_4Yp',
};

const adInquiryUrl = 'https://0ntm7gxvv3y.typeform.com/to/r75u0iEC';

const problemChips = serviceCategories.filter(({ code }) =>
  [
    'VISA_IMMIGRATION',
    'KOREAN_LANGUAGE',
    'HOUSING',
    'BANKING_FINANCE',
    'MOBILE_INTERNET',
    'HEALTHCARE',
    'JOB_CAREER',
    'DAILY_LIFE',
  ].includes(code)
);

function useHorizontalDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    suppressNextClick: false,
  });

  const startDrag = (clientX: number) => {
    const target = ref.current;
    if (!target) return;

    dragState.current = {
      isDragging: true,
      startX: clientX,
      startScrollLeft: target.scrollLeft,
      suppressNextClick: false,
    };
  };

  const moveDrag = (clientX: number) => {
    const target = ref.current;
    const state = dragState.current;
    if (!target || !state.isDragging) return;

    const deltaX = clientX - state.startX;
    if (Math.abs(deltaX) > 3) {
      state.suppressNextClick = true;
      target.scrollLeft = state.startScrollLeft - deltaX;
    }
  };

  const endDrag = () => {
    dragState.current.isDragging = false;
  };

  const handlePointerDown = (event: ReactPointerEvent<T>) => {
    startDrag(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<T>) => {
    moveDrag(event.clientX);
  };

  const handlePointerUp = (event: ReactPointerEvent<T>) => {
    endDrag();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleMouseDown = (event: ReactMouseEvent<T>) => {
    startDrag(event.clientX);
  };

  const handleMouseMove = (event: ReactMouseEvent<T>) => {
    moveDrag(event.clientX);
  };

  const handleTouchStart = (event: ReactTouchEvent<T>) => {
    const touch = event.touches[0];
    if (!touch) return;

    startDrag(touch.clientX);
  };

  const handleTouchMove = (event: ReactTouchEvent<T>) => {
    const touch = event.touches[0];
    if (!touch) return;

    moveDrag(touch.clientX);
  };

  const handleClickCapture = (event: ReactMouseEvent<T>) => {
    if (!dragState.current.suppressNextClick) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.suppressNextClick = false;
  };

  return {
    ref,
    onClickCapture: handleClickCapture,
    onMouseDown: handleMouseDown,
    onMouseLeave: endDrag,
    onMouseMove: handleMouseMove,
    onMouseUp: endDrag,
    onPointerDown: handlePointerDown,
    onPointerLeave: handlePointerUp,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onTouchEnd: endDrag,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
  };
}

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: featuredBlog, refetch: refetchFeaturedBlog } = useFeaturedBlogs();
  const [selectedDiscoveryType, setSelectedDiscoveryType] = useState<DiscoveryFilter>('ALL');
  const discoveryDragScroll = useHorizontalDragScroll<HTMLDivElement>();
  const serviceCategoryDragScroll = useHorizontalDragScroll<HTMLDivElement>();
  // FCM 토큰 요청 (중복 방지)
  const tokenRequested = useRef(false);

  const visibleDiscoveryItems = useMemo(
    () =>
      selectedDiscoveryType === 'ALL'
        ? discoveryItems
        : discoveryItems.filter((item) => item.type === selectedDiscoveryType),
    [selectedDiscoveryType]
  );

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
      <main className="space-y-5 bg-bg-default pb-24 pt-4">
        <section className="px-5">
          <h2 className="text-lg font-bold leading-6 text-text-strong">Discovery</h2>

          <div className="mt-3 flex gap-2">
            {discoveryFilters.map((filter) => {
              const isSelected = selectedDiscoveryType === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={isSelected}
                  className={`h-8 rounded-full border px-3 text-xs font-semibold ${
                    isSelected
                      ? 'border-border-brand-default bg-bg-brand-default text-white'
                      : 'border-border-weak2 bg-white text-text-default'
                  }`}
                  onClick={() => setSelectedDiscoveryType(filter)}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div
            role="region"
            aria-label="Discovery carousel"
            {...discoveryDragScroll}
            className="mt-3 flex snap-x gap-3 overflow-x-auto overscroll-x-contain pb-1 touch-pan-x [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
          >
            {visibleDiscoveryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="min-h-[118px] w-[78%] max-w-[320px] shrink-0 snap-start rounded-lg border border-border-weak2 bg-white px-4 py-4 text-left shadow-[0px_2px_8px_rgba(0,0,0,0.06)]"
                onClick={() => navigate(`/discovery/${item.id}`)}
              >
                <span className="inline-flex rounded-full bg-bg-brand-weak px-2.5 py-1 text-xs font-semibold text-text-brand-default">
                  {item.type}
                </span>
                <span className="mt-3 block text-base font-bold leading-5 text-text-strong">{item.title}</span>
                <span className="mt-1.5 block text-xs leading-4 text-text-default">{item.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5">
          <h1 className="text-2xl font-bold leading-8 text-text-strong">What do you need help with in Korea?</h1>
          <p className="mt-2 text-sm leading-5 text-text-default">
            Find practical support from K-Buddies who understand life here.
          </p>

          <div
            role="region"
            aria-label="Service categories"
            {...serviceCategoryDragScroll}
            className="mt-4 flex snap-x gap-2 overflow-x-auto overscroll-x-contain pb-1 touch-pan-x [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
          >
            {problemChips.map((chip) => (
              <button
                key={chip.code}
                type="button"
                className="h-9 shrink-0 snap-start rounded-full border border-border-weak2 bg-white px-4 text-sm font-medium text-text-default"
                onClick={() => navigate(`/service?category=${chip.code}`)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-5">
          <div className="rounded-lg bg-[#EAF7F2] px-5 py-5">
            <p className="text-xs font-semibold uppercase text-[#23745A]">Limited offer</p>
            <h2 className="mt-2 text-xl font-bold leading-7 text-text-strong">First consultation made easier</h2>
            <p className="mt-2 text-sm leading-5 text-text-default">
              Start with a live chat session and get matched with the right help for everyday life in Korea.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#23745A] px-4 text-sm font-semibold text-white"
              onClick={() => navigate('/service')}
            >
              Explore services
              <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {featuredBlog && (
          <SwiperList
            cards={featuredBlog.data.results}
            layout="home"
            onLike={featuredHandleLike}
            onBookmark={featuredHandleBookmark}
          />
        )}

        <section className="px-5">
          <div className="rounded-lg bg-[#F4F0FF] px-5 py-5">
            <p className="text-xs font-semibold uppercase text-text-brand-default">For experienced locals</p>
            <h2 className="mt-2 text-xl font-bold leading-7 text-text-strong">Become a K-Buddy counselor</h2>
            <p className="mt-2 text-sm leading-5 text-text-default">
              Share your experience, set your own schedule, and earn from live consultations.
            </p>

            <div className="mt-4 grid gap-2 text-sm text-text-default">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-bg-brand-default" />
                Flexible schedule
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-bg-brand-default" />
                Paid consultations
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-bg-brand-default" />
                Support newcomers in Korea
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-bg-brand-default px-4 text-sm font-semibold text-white"
              onClick={() => navigate('/profile?tab=My%20sale')}
            >
              Become a counselor
              <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        <section className="px-5">
          <div className="rounded-lg border border-border-weak2 bg-white p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-text-brand-default">Sponsored by {homeAd.sponsor}</p>
                <h2 className="mt-2 text-xl font-bold leading-7 text-text-strong">{homeAd.title}</h2>
                <p className="mt-2 text-sm leading-5 text-text-default">{homeAd.description}</p>
                <p className="mt-3 rounded-lg bg-bg-brand-weak px-3 py-2 text-xs font-semibold leading-4 text-text-brand-default">
                  {homeAd.offer}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-bg-brand-weak">
                <span className="text-lg font-bold text-text-brand-default">SIM</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-bg-brand-default px-4 text-sm font-semibold text-white"
                onClick={() => window.open(homeAd.href, '_blank', 'noopener,noreferrer')}
              >
                {homeAd.cta}
                <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border-brand-default px-4 text-sm font-semibold text-text-brand-default"
                onClick={() => window.open(adInquiryUrl, '_blank', 'noopener,noreferrer')}
              >
                Advertise with K-Buddy
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
