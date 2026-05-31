import { Button, Navbar } from '@/components';
import { BasicUserData } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { authService } from '@/services';
import { MypageTab } from '@/components/community/tab';
import { NoContent } from '@/components/community/detail';
import { BookmarkList } from '@/components/mypage/BookmarkList';
import { ServiceCard } from '@/components/service';
import { counselorService } from '@/services/counselorService';
import type { MyCounselorProfile } from '@/services/counselorService';
import { bookingService } from '@/services/bookingService';
import type { CounselorBooking, MyBooking } from '@/services/bookingService';

export function ProfilePage() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<BasicUserData | null>(null);
  const [myCounselorProfile, setMyCounselorProfile] = useState<MyCounselorProfile | null>(null);
  const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [counselorBookings, setCounselorBookings] = useState<CounselorBooking[]>([]);
  const [isLoadingCounselorBookings, setIsLoadingCounselorBookings] = useState(false);
  const [counselorBookingsError, setCounselorBookingsError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'My sale';
  const currentSaleTab = searchParams.get('saleTab') === 'Listings' ? 'Listings' : 'Sales';

  const onClickEditProfile = () => {
    navigate('/profile/edit');
  };

  const onClickSettings = () => {
    navigate('/settings');
  };

  const onClickCreateCounselorProfile = () => {
    if (myCounselorProfile) {
      setPopupMessage('You have already created a counselor profile.');
      return;
    }

    navigate('/profile/counselor/create');
  };

  const onClickSaleTab = (saleTab: 'Sales' | 'Listings') => {
    navigate(`/profile?tab=${encodeURIComponent('My sale')}&saleTab=${encodeURIComponent(saleTab)}`, {
      replace: true,
    });
  };

  const openBookingDetail = (booking: CounselorBooking | MyBooking, viewer: 'counselor' | 'customer') => {
    navigate(`/profile/bookings/${booking.bookingId}`, {
      state: {
        booking,
        viewer,
      },
    });
  };

  useEffect(() => {
    const getUserProfile = async (): Promise<BasicUserData | null> => {
      try {
        const response = await authService.getUserProfile();
        const basicUserData = response.data;
        localStorage.setItem('basicUserData', JSON.stringify(basicUserData));
        return basicUserData;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userInfo = await getUserProfile();
        if (userInfo) {
          setUser(userInfo);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (currentTab !== 'My sale') return;

    const fetchMyCounselorProfile = async () => {
      try {
        const profile = await counselorService.getMyProfile();
        setMyCounselorProfile(profile);
      } catch (error: any) {
        if (error?.response?.status === 400) {
          setMyCounselorProfile(null);
          return;
        }

        console.error(error);
      }
    };

    fetchMyCounselorProfile();
  }, [currentTab]);

  useEffect(() => {
    if (currentTab !== 'Orders') return;

    const fetchMyBookings = async () => {
      setIsLoadingBookings(true);
      setBookingsError('');

      try {
        const bookings = await bookingService.getMyBookings();
        setMyBookings(bookings);
      } catch (error) {
        console.error(error);
        setBookingsError('Unable to load your orders. Please try again.');
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchMyBookings();
  }, [currentTab]);

  useEffect(() => {
    if (currentTab !== 'My sale' || currentSaleTab !== 'Listings') return;

    const fetchCounselorBookings = async () => {
      setIsLoadingCounselorBookings(true);
      setCounselorBookingsError('');

      try {
        const bookings = await bookingService.getCounselorBookings();
        setCounselorBookings(bookings);
      } catch (error) {
        console.error(error);
        setCounselorBookingsError('Unable to load your listings. Please try again.');
      } finally {
        setIsLoadingCounselorBookings(false);
      }
    };

    fetchCounselorBookings();
  }, [currentSaleTab, currentTab]);

  return (
    <>
      {popupMessage && <ExistingCounselorProfileModal message={popupMessage} onClose={() => setPopupMessage('')} />}
      <Navbar withSearch={false} onClickSettings={onClickSettings} />
      <div className="flex flex-col px-4 pt-4 pb-5 text-text-default">
        <div className="flex gap-2 items-center mb-2">
          <img
            src={user?.profileImageUrl ? user.profileImageUrl : defaultProfileImage}
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="font-medium">@{user?.userId}</span>
        </div>
        <div className="mb-5">{user?.bio}</div>
        <Button variant="outline" color="secondary" className="w-full" onClick={onClickEditProfile}>
          Edit profile
        </Button>
        {/* 비즈니스 멤버 유무 */}
        <div className="py-4"></div>
        <MypageTab />
      </div>
      {currentTab === 'Saved' && <BookmarkList />}
      {currentTab === 'My post' && <NoContent type="blog" />}
      {currentTab === 'Orders' && (
        <MyOrdersSection
          bookings={myBookings}
          error={bookingsError}
          isLoading={isLoadingBookings}
          onOpenDetail={openBookingDetail}
        />
      )}
      {currentTab === 'My sale' && (
        <div className="px-4 pt-2 pb-24">
          <MySaleSubmenu currentSaleTab={currentSaleTab} onChange={onClickSaleTab} />
          {currentSaleTab === 'Sales' && (
            <>
              {myCounselorProfile ? (
                <MyCounselorProfileCard
                  profile={myCounselorProfile}
                  onClick={() =>
                    navigate(`/service/${myCounselorProfile.id}`, { state: { service: myCounselorProfile } })
                  }
                />
              ) : (
                <MySaleEmptyState>There aren&apos;t any sales activity to view at this moment.</MySaleEmptyState>
              )}
              <Button variant="solid" color="primary" className="mt-4 w-full" onClick={onClickCreateCounselorProfile}>
                Create counselor profile
              </Button>
            </>
          )}
          {currentSaleTab === 'Listings' && (
            <CounselorListingsSection
              bookings={counselorBookings}
              error={counselorBookingsError}
              isLoading={isLoadingCounselorBookings}
              onOpenDetail={openBookingDetail}
            />
          )}
        </div>
      )}
    </>
  );
}

function CounselorListingsSection({
  bookings,
  error,
  isLoading,
  onOpenDetail,
}: {
  bookings: CounselorBooking[];
  error: string;
  isLoading: boolean;
  onOpenDetail: (booking: CounselorBooking, viewer: 'counselor') => void;
}) {
  if (isLoading) {
    return <div className="text-center text-text-weak font-roboto text-body-200-light">Loading listings...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <MySaleEmptyState>{error}</MySaleEmptyState>
      </div>
    );
  }

  if (bookings.length === 0) {
    return <MySaleEmptyState>There aren&apos;t any listings to manage at this moment.</MySaleEmptyState>;
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <CounselorListingCard
          key={booking.bookingId}
          booking={booking}
          onClick={() => onOpenDetail(booking, 'counselor')}
        />
      ))}
    </div>
  );
}

function CounselorListingCard({ booking, onClick }: { booking: CounselorBooking; onClick: () => void }) {
  const customerName = booking.customerName || 'Customer';
  const customerUsername = booking.customerUsername ? `@${booking.customerUsername}` : '';
  const topic = booking.topic || 'Live chat counseling';
  const schedule = formatBookingSchedule(booking.bookingStartUtc, booking.bookingEndUtc);
  const totalPrice = typeof booking.totalPrice === 'number' ? `${booking.totalPrice.toLocaleString()} won` : '-';

  return (
    <button
      type="button"
      className="w-full rounded-lg border border-border-weak1 bg-white px-4 py-4 text-left shadow-default"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-text-weak font-roboto text-[12px] font-normal leading-4">Booking #{booking.bookingId}</p>
          <h2 className="mt-1 break-words text-text-default font-roboto text-[16px] font-medium leading-6">{topic}</h2>
          <p className="mt-1 text-text-default font-roboto text-[14px] font-medium leading-5">{customerName}</p>
          {customerUsername && (
            <p className="mt-0.5 text-text-weak font-roboto text-[14px] font-normal leading-5">{customerUsername}</p>
          )}
        </div>
        <span className="shrink-0 rounded bg-bg-brand-weak px-2 py-1 text-text-brand-default font-roboto text-[12px] font-medium leading-4">
          {booking.status}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-border-weak1 pt-3">
        <OrderInfoRow label="Birth date" value={booking.birthDate || '-'} />
        <OrderInfoRow label="Schedule" value={schedule} />
        <OrderInfoRow label="Total" value={totalPrice} />
      </div>
    </button>
  );
}

function MyOrdersSection({
  bookings,
  error,
  isLoading,
  onOpenDetail,
}: {
  bookings: MyBooking[];
  error: string;
  isLoading: boolean;
  onOpenDetail: (booking: MyBooking, viewer: 'customer') => void;
}) {
  if (isLoading) {
    return (
      <div className="px-4 pt-2 pb-24 text-center text-text-weak font-roboto text-body-200-light">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="px-4 pt-2 pb-24">
        <MySaleEmptyState>{error}</MySaleEmptyState>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="px-4 pt-2 pb-24">
        <MySaleEmptyState>There aren&apos;t any orders to view at this moment.</MySaleEmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-2 pb-24">
      {bookings.map((booking) => (
        <MyOrderCard key={booking.bookingId} booking={booking} onClick={() => onOpenDetail(booking, 'customer')} />
      ))}
    </div>
  );
}

function MyOrderCard({ booking, onClick }: { booking: MyBooking; onClick: () => void }) {
  const title = booking.topic || booking.title || booking.serviceTitle || 'Live chat counseling';
  const counselorName = booking.counselorUsername || booking.counselorName;
  const counselorImageAlt = counselorName || title;
  const schedule = formatBookingSchedule(booking.bookingStartUtc, booking.bookingEndUtc);
  const totalPrice = typeof booking.totalPrice === 'number' ? `${booking.totalPrice.toLocaleString()} won` : '-';

  return (
    <button
      type="button"
      className="rounded-lg border border-border-weak1 bg-white px-4 py-4 text-left shadow-default"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <img
          src={booking.counselorCoverImageUrl || defaultProfileImage}
          alt={counselorImageAlt}
          className="h-14 w-14 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-text-weak font-roboto text-[12px] font-normal leading-4">
                Booking #{booking.bookingId}
              </p>
              <h2 className="mt-1 break-words text-text-default font-roboto text-[16px] font-medium leading-6">
                {title}
              </h2>
              {counselorName && (
                <p className="mt-1 text-text-weak font-roboto text-[14px] font-normal leading-5">@{counselorName}</p>
              )}
            </div>
            <span className="shrink-0 rounded bg-bg-brand-weak px-2 py-1 text-text-brand-default font-roboto text-[12px] font-medium leading-4">
              {booking.status}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-border-weak1 pt-3">
            <OrderInfoRow label="Schedule" value={schedule} />
            <OrderInfoRow label="Total" value={totalPrice} />
          </div>
        </div>
      </div>
    </button>
  );
}

function MySaleSubmenu({
  currentSaleTab,
  onChange,
}: {
  currentSaleTab: 'Sales' | 'Listings';
  onChange: (saleTab: 'Sales' | 'Listings') => void;
}) {
  return (
    <div className="mb-4 grid grid-cols-2 rounded-lg bg-bg-medium p-1" aria-label="My sale submenu">
      {(['Sales', 'Listings'] as const).map((saleTab) => {
        const isActive = currentSaleTab === saleTab;

        return (
          <button
            key={saleTab}
            type="button"
            aria-pressed={isActive}
            className={`h-10 rounded-md text-body-200-medium font-medium transition-colors ${
              isActive ? 'bg-bg-default text-text-brand-default shadow-default' : 'text-text-weak'
            }`}
            onClick={() => onChange(saleTab)}
          >
            {saleTab}
          </button>
        );
      })}
    </div>
  );
}

function MySaleEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-bg-medium px-4 py-5 text-center text-text-default font-roboto text-body-200-light leading-5">
      {children}
    </div>
  );
}

function OrderInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-text-weak font-roboto text-[14px] font-normal leading-5">{label}</span>
      <span className="max-w-[65%] text-right text-text-default font-roboto text-[14px] font-medium leading-5">
        {value}
      </span>
    </div>
  );
}

function formatBookingSchedule(startUtc?: string, endUtc?: string) {
  const start = formatLocalDateTime(startUtc);
  const end = formatLocalTime(endUtc);

  if (start === '-') return '-';
  if (end === '-') return start;

  return `${start} - ${end}`;
}

function formatLocalDateTime(dateTime?: string) {
  if (!dateTime) return '-';

  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatLocalTime(dateTime?: string) {
  if (!dateTime) return '-';

  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function ExistingCounselorProfileModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Existing counselor profile"
        className="w-full max-w-[360px] rounded-lg bg-white px-5 py-5 shadow-default"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-text-default font-roboto text-[16px] font-medium leading-6">{message}</p>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="solid" color="primary" size="medium" className="h-10 px-6" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

function MyCounselorProfileCard({ onClick, profile }: { onClick: () => void; profile: MyCounselorProfile }) {
  const categories = Array.isArray(profile.categories) ? profile.categories : [];
  const regularPrice = typeof profile.regularPrice === 'number' ? profile.regularPrice : 0;
  const sessionMinutes = typeof profile.sessionMinutes === 'number' ? profile.sessionMinutes : 0;

  return (
    <ServiceCard
      imageUrl={profile.coverImageUrl || profile.profileImageUrl || defaultProfileImage}
      title={profile.title}
      sellerId={`@${profile.name}`}
      rating={getAverageRating(profile)}
      categoryName={categories.length > 0 ? categories.join(', ') : 'No category'}
      duration={`${sessionMinutes} min`}
      price={`${regularPrice.toLocaleString()} won`}
      categoryType="1:1 Chat"
      onClick={onClick}
    />
  );
}

function getAverageRating(profile: MyCounselorProfile) {
  if (!Array.isArray(profile.recentReviews) || profile.recentReviews.length === 0) return 0;

  const ratingSum = profile.recentReviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((ratingSum / profile.recentReviews.length).toFixed(1));
}
