import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/shared/button/Button';
import { StepIndicator } from '@/components/shared/step-indicator/StepIndicator';
import { Topbar } from '@/components/shared/topbar/Topbar';
import type { BookingReserveResponse } from '@/services/bookingService';

const depositAccount = {
  accountHolder: '최수용',
  accountNumber: '649301-04-167585',
  bankName: 'KB Bank(국민은행)',
};

const steps = [
  { label: 'Request Live Chat', status: 'completed' as const },
  { label: 'Confirm Order', status: 'completed' as const },
  { label: 'Order placed', status: 'current' as const },
];

type OrderPlacedState = {
  booking?: BookingReserveResponse | { data?: BookingReserveResponse };
  depositDeadlineAt?: string;
};

export function LiveChatOrderPlacedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderState = location.state as OrderPlacedState | null;
  const booking = normalizeBooking(orderState?.booking);

  const handleClose = () => {
    navigate(`/service/${id}`, { replace: true, state: { backTo: '/service' } });
  };

  const handleOk = () => {
    navigate('/service', { replace: true });
  };

  const totalPrice = booking ? formatWon(booking.totalPrice) : '-';
  const depositDeadlineAt = orderState?.depositDeadlineAt || booking?.holdExpiresAt;
  const depositDeadline = depositDeadlineAt ? formatLocalDateTime(depositDeadlineAt) : '-';
  const bookingNumber = booking ? `Booking #${booking.bookingId}` : 'Booking pending';

  return (
    <div className="w-full min-h-screen bg-bg-default pb-10">
      <Topbar title="" type="cancel" onCancle={handleClose} />

      <div className="mt-[72px]">
        <StepIndicator steps={steps} currentStep={2} />
      </div>

      <main className="flex flex-col px-4 py-6">
        <section className="flex flex-col items-center text-center">
          <OrderPlacedIllustration />

          <p className="mt-6 text-text-weak font-roboto text-[14px] font-normal leading-5 tracking-[0.25px]">
            {bookingNumber}
          </p>
          <h1 className="mt-1 text-text-default font-roboto text-[24px] font-medium leading-8">
            Waiting for bank transfer
          </h1>
          <p className="mt-3 max-w-[420px] text-text-weak font-roboto text-[16px] font-normal leading-6 tracking-[0.5px]">
            Please transfer the exact amount below. Your live chat room will be created as soon as an admin confirms the
            payment.
          </p>
        </section>

        <section className="mt-8 flex flex-col gap-3">
          <h2 className="text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
            Transfer details
          </h2>
          <div className="flex flex-col rounded-lg border border-border-weak1 bg-white">
            <InfoRow label="Amount" value={totalPrice} strong />
            <InfoRow label="Bank" value={`${depositAccount.bankName} ${depositAccount.accountNumber}`} />
            <InfoRow label="Account holder" value={depositAccount.accountHolder} />
            <InfoRow label="Deposit deadline" value={depositDeadline} />
          </div>
        </section>

        <section className="mt-4 rounded-lg bg-bg-medium px-4 py-3">
          <p className="text-text-weak font-roboto text-[14px] font-normal leading-5 tracking-[0.25px]">
            Use the booking number or your name as the transfer note so the admin can confirm your payment faster.
          </p>
        </section>

        <Button
          type="button"
          variant="solid"
          color="primary"
          size="large"
          onClick={handleOk}
          className="mt-8 h-[58px] w-full text-[20px] font-medium"
        >
          Go to service
        </Button>
      </main>
    </div>
  );
}

function formatWon(amount: number) {
  return `${new Intl.NumberFormat('en-US').format(amount)} won`;
}

function formatLocalDateTime(dateTime: string) {
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

function normalizeBooking(
  booking?: BookingReserveResponse | { data?: BookingReserveResponse }
): BookingReserveResponse | undefined {
  if (!booking) return undefined;
  return 'data' in booking ? booking.data : (booking as BookingReserveResponse);
}

function InfoRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-weak1 px-4 py-3 last:border-b-0">
      <span className="text-text-weak font-roboto text-[14px] font-normal leading-5 tracking-[0.25px]">{label}</span>
      <span
        className={`max-w-[60%] text-right font-roboto text-[16px] leading-6 tracking-[0.5px] ${
          strong ? 'text-text-default font-medium' : 'text-text-default font-normal'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function OrderPlacedIllustration() {
  return (
    <div className="flex h-[182px] w-[182px] items-center justify-center rounded-full bg-[#F0EDFF]" aria-hidden="true">
      <svg width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48 56H96L91 119H43L48 56Z" fill="#F8F7FF" stroke="#5D4EF6" strokeWidth="3" />
        <path d="M43 119H91L99 133H51L43 119Z" fill="#5D4EF6" />
        <path d="M96 56L99 133L91 119L96 56Z" fill="#8B80FF" stroke="#5D4EF6" strokeWidth="3" />
        <path
          d="M60 56V40C60 31.7157 66.7157 25 75 25C83.2843 25 90 31.7157 90 40V56"
          stroke="#5D4EF6"
          strokeWidth="3"
        />
        <path d="M68 56V40C68 36.134 71.134 33 75 33C78.866 33 82 36.134 82 40V56" stroke="#5D4EF6" strokeWidth="3" />
        <path d="M88 50L123 28L137 51L102 73L88 65V50Z" fill="#F8F7FF" stroke="#5D4EF6" strokeWidth="3" />
        <circle cx="99" cy="55" r="4" fill="#F8F7FF" stroke="#5D4EF6" strokeWidth="3" />
        <path d="M60 88H83" stroke="#5D4EF6" strokeWidth="6" strokeLinecap="round" />
        <path d="M56 80H82" stroke="#5D4EF6" strokeWidth="6" strokeLinecap="round" />
        <path d="M28 35L31 44L40 47L31 50L28 59L25 50L16 47L25 44L28 35Z" fill="#1F1F25" />
        <path d="M116 82L121 96L135 101L121 106L116 120L111 106L97 101L111 96L116 82Z" fill="#1F1F25" />
        <path d="M78 9L80 14L85 16L80 18L78 23L76 18L71 16L76 14L78 9Z" fill="#1F1F25" />
      </svg>
    </div>
  );
}
