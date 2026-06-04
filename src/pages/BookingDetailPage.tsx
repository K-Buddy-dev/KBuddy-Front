import { useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { Button } from '@/components/shared/button/Button';
import { Topbar } from '@/components/shared/topbar/Topbar';
import { chatService } from '@/services/chatService';
import { bookingService, type CounselorBooking, type MyBooking } from '@/services/bookingService';
import { useEffect, useState } from 'react';

type BookingDetailState =
  | {
      booking: CounselorBooking;
      viewer: 'counselor';
    }
  | {
      booking: MyBooking;
      viewer: 'customer';
    };

export function BookingDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const state = location.state as BookingDetailState | null;
  const [chatError, setChatError] = useState('');
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [loadedState, setLoadedState] = useState<BookingDetailState | null>(state);
  const [isLoadingBooking, setIsLoadingBooking] = useState(!state && Boolean(bookingId));

  useEffect(() => {
    if (state || !bookingId) return;

    let isMounted = true;

    const loadBooking = async () => {
      setIsLoadingBooking(true);

      try {
        const [counselorBookings, myBookings] = await Promise.all([
          bookingService.getCounselorBookings({ page: 0, size: 50 }),
          bookingService.getMyBookings({ page: 0, size: 50 }),
        ]);
        const counselorBooking = counselorBookings.find((item) => String(item.bookingId) === bookingId);
        const myBooking = myBookings.find((item) => String(item.bookingId) === bookingId);

        if (!isMounted) return;

        if (counselorBooking) {
          setLoadedState({ booking: counselorBooking, viewer: 'counselor' });
          return;
        }

        if (myBooking) {
          setLoadedState({ booking: myBooking, viewer: 'customer' });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoadingBooking(false);
        }
      }
    };

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [bookingId, state]);

  const booking = loadedState?.booking;
  const viewer = loadedState?.viewer;

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenChat = async () => {
    if (!booking) return;

    setIsOpeningChat(true);
    setChatError('');

    try {
      const room = await chatService.getRoomByBooking(booking.bookingId);
      navigate(`/message/${room.roomId}`, {
        state: {
          peerProfileImageUrl: viewer === 'customer' ? (booking as MyBooking).counselorCoverImageUrl : undefined,
          roomName: room.name || getBookingTitle(booking),
        },
      });
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setChatError('Chat room is not ready yet.');
        return;
      }

      console.error(error);
      setChatError('Unable to open chat room. Please try again.');
    } finally {
      setIsOpeningChat(false);
    }
  };

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-bg-default pb-10">
        <Topbar title="Order detail" type="back" onBack={handleBack} />
        <main className="mt-[72px] px-4">
          <div className="flex h-64 items-center justify-center text-text-weak">Loading order...</div>
        </main>
      </div>
    );
  }

  if (!booking || !viewer) {
    return (
      <div className="min-h-screen bg-bg-default pb-10">
        <Topbar title="Order detail" type="back" onBack={handleBack} />
        <main className="mt-[72px] px-4">
          <section className="rounded-lg bg-bg-medium px-4 py-5 text-center">
            <h1 className="text-text-default font-roboto text-[18px] font-medium leading-6">
              Order information is unavailable.
            </h1>
            <p className="mt-2 text-text-weak font-roboto text-[14px] font-normal leading-5">
              Please return to your orders and open this booking again.
            </p>
          </section>
        </main>
      </div>
    );
  }

  const title = getBookingTitle(booking);
  const totalPrice = typeof booking.totalPrice === 'number' ? `${booking.totalPrice.toLocaleString()} won` : '-';
  const schedule = formatBookingSchedule(booking.bookingStartUtc, booking.bookingEndUtc);
  const counselorBooking = viewer === 'counselor' ? (booking as CounselorBooking) : null;
  const customerBooking = viewer === 'customer' ? (booking as MyBooking) : null;
  const personName = counselorBooking
    ? counselorBooking.customerName || 'Customer'
    : getCounselorName(customerBooking!);
  const username = counselorBooking
    ? counselorBooking.customerUsername
    : customerBooking?.counselorUsername || customerBooking?.counselorName;
  const imageSrc = customerBooking
    ? customerBooking.counselorCoverImageUrl || defaultProfileImage
    : defaultProfileImage;
  const imageAlt = personName || title;
  const requestDetails = booking.topic || '-';

  return (
    <div className="min-h-screen bg-bg-default pb-28">
      <Topbar title="Order detail" type="back" onBack={handleBack} />

      <main className="mt-[72px] flex flex-col gap-5 px-4 py-4">
        <section className="rounded-lg border border-border-weak1 bg-white px-4 py-4 shadow-default">
          <div className="flex items-start gap-3">
            <img src={imageSrc} alt={imageAlt} className="h-14 w-14 shrink-0 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-text-weak font-roboto text-[12px] font-normal leading-4">
                Booking #{booking.bookingId || bookingId}
              </p>
              <h1 className="mt-1 break-words text-text-default font-roboto text-[20px] font-medium leading-7">
                {title}
              </h1>
              <span className="mt-2 inline-flex rounded bg-bg-brand-weak px-2 py-1 text-text-brand-default font-roboto text-[12px] font-medium leading-4">
                {booking.status}
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-text-default font-roboto text-[18px] font-medium leading-6">
            {viewer === 'counselor' ? 'Customer information' : 'Counselor information'}
          </h2>
          <div className="flex flex-col rounded-lg border border-border-weak1 bg-white">
            <DetailRow label={viewer === 'counselor' ? 'Customer' : 'Counselor'} value={personName} />
            {username && <DetailRow label="Username" value={`@${username}`} />}
            {counselorBooking && <DetailRow label="Birth date" value={counselorBooking.birthDate || '-'} />}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-text-default font-roboto text-[18px] font-medium leading-6">Request details</h2>
          <p
            data-testid="booking-request-details"
            className="whitespace-pre-line rounded-lg border border-border-weak1 bg-white px-4 py-3 text-text-default font-roboto text-[16px] font-normal leading-6"
          >
            {requestDetails}
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-text-default font-roboto text-[18px] font-medium leading-6">Order information</h2>
          <div className="flex flex-col rounded-lg border border-border-weak1 bg-white">
            <DetailRow label="Schedule" value={schedule} />
            <DetailRow label="Total" value={totalPrice} strong />
          </div>
        </section>

        {chatError && (
          <p
            role="alert"
            className="rounded-lg bg-bg-medium px-4 py-3 text-text-default font-roboto text-[14px] leading-5"
          >
            {chatError}
          </p>
        )}
      </main>

      <div className="fixed bottom-0 left-1/2 flex h-20 min-w-[280px] w-full -translate-x-1/2 items-start border-t border-border-weak1 bg-white sm:w-[600px]">
        <div className="w-full px-4 pt-3">
          <Button
            type="button"
            variant="solid"
            color="primary"
            size="large"
            disabled={isOpeningChat}
            onClick={handleOpenChat}
            className="h-12 w-full"
          >
            {isOpeningChat ? 'Opening...' : 'Open chat'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getBookingTitle(booking: CounselorBooking | MyBooking) {
  if ('serviceTitle' in booking) {
    return booking.topic || booking.title || booking.serviceTitle || 'Live chat counseling';
  }

  return booking.topic || 'Live chat counseling';
}

function getCounselorName(booking: MyBooking) {
  return booking.counselorUsername || booking.counselorName || 'Counselor';
}

function DetailRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-weak1 px-4 py-3 last:border-b-0">
      <span className="text-text-weak font-roboto text-[14px] font-normal leading-5">{label}</span>
      <span
        className={`max-w-[62%] text-right font-roboto text-[16px] leading-6 ${
          strong ? 'text-text-default font-medium' : 'text-text-default font-normal'
        }`}
      >
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
    month: 'short',
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
