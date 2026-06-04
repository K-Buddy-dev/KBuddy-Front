import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '@/components/shared/topbar/Topbar';
import { Button } from '@/components/shared/button/Button';
import { StepIndicator } from '@/components/shared/step-indicator/StepIndicator';
import { RequestLiveChatData } from '@/utils/validationSchemas';
import { bookingService } from '@/services/bookingService';
import { analyticsService } from '@/services/analyticsService';
import { analyticsEvents } from '@/services/analyticsEvents';

type LiveChatRequestState = {
  request?: Omit<RequestLiveChatData, 'selectedDate'> & {
    selectedDate: string;
    slotIds?: number[];
  };
};

const steps = [
  { label: 'Request live chat', status: 'completed' as const },
  { label: 'Confirm order', status: 'current' as const },
  { label: 'Order placed', status: 'disabled' as const },
];

const formatSelectedDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export function ConfirmLiveChatOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const request = (location.state as LiveChatRequestState | null)?.request;
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(`/service/${id}`);
  };

  const handlePlaceOrder = async () => {
    if (!request || !id) return;

    const slotIds = request.slotIds ?? [];
    if (slotIds.length === 0) {
      setOrderError('Please select an available time before placing your order.');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError('');

    try {
      const birthDate = formatBirthDateForApi(request.dateOfBirth);
      if (!birthDate) {
        setOrderError('Use a valid date in MM/DD/YYYY format.');
        return;
      }

      const booking = await bookingService.reserve({
        birthDate,
        counselorId: id,
        slotIds,
        topic: request.topic,
      });
      analyticsService.trackEvent(analyticsEvents.bookingCompleted, {
        booking_id: booking.bookingId,
        counselor_id: id,
        currency: 'KRW',
        slot_count: booking.slotCount,
        value: booking.totalPrice,
      });
      navigate(`/service/${id}/request/placed`, {
        state: {
          booking,
          depositDeadlineAt: getDepositDeadlineAt(),
        },
      });
    } catch (error) {
      console.error('Failed to place live chat order:', error);
      setOrderError('Unable to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!request) {
    return (
      <div className="w-full min-h-screen bg-bg-default pb-24">
        <Topbar title="Confirm order" type="cancel" onCancle={handleClose} />
        <div className="mt-[72px]">
          <StepIndicator steps={steps} currentStep={1} />
        </div>
        <div className="flex flex-col gap-4 px-4 py-8">
          <h1 className="text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
            Request details are missing
          </h1>
          <p className="text-text-weak font-roboto text-[14px] font-normal leading-5 tracking-[0.25px]">
            Please go back and fill out the live chat request again.
          </p>
          <Button variant="solid" color="primary" size="medium" onClick={handleBack}>
            Back to request
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${request.firstName} ${request.lastName}`;
  const selectedDate = formatSelectedDate(request.selectedDate);
  const selectedTimes = request.timeSlots.join(', ');

  return (
    <div className="w-full min-h-screen bg-bg-default pb-32">
      <Topbar title="Confirm order" type="cancel" onCancle={handleClose} />

      <div className="mt-[72px]">
        <StepIndicator steps={steps} currentStep={1} />
      </div>

      <div className="flex flex-col gap-6 px-4 py-6">
        <section className="flex flex-col gap-4">
          <h1 className="text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
            Confirm order
          </h1>
          <div className="flex flex-col rounded-lg border border-border-weak1 bg-white">
            <SummaryRow label="Name" value={fullName} />
            <SummaryRow label="Date of birth" value={request.dateOfBirth} />
            <SummaryRow label="Date" value={selectedDate} />
            <SummaryRow label="Time" value={selectedTimes} />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
            Live chat topic
          </h2>
          <p className="rounded-lg border border-border-weak1 bg-white p-4 text-text-default font-roboto text-[16px] font-normal leading-6 tracking-[0.5px] whitespace-pre-line">
            {request.topic}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
            Payment summary
          </h2>
          <div className="flex flex-col rounded-lg border border-border-weak1 bg-white">
            <SummaryRow label="Live chat" value="20,000 won" />
            <SummaryRow label="Duration" value="30 min" />
            <SummaryRow label="Total" value="20,000 won" strong />
          </div>
        </section>

        {orderError && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-700 font-roboto text-[14px] leading-5">
            {orderError}
          </p>
        )}
      </div>

      <div
        data-testid="confirm-action-bar"
        className="fixed bottom-0 left-1/2 flex h-20 min-w-[280px] w-full -translate-x-1/2 items-start border-t border-border-weak1 bg-white sm:w-[600px]"
      >
        <div className="flex w-full px-4 pt-3 justify-between items-center">
          <Button
            type="button"
            variant="link"
            color="secondary"
            size="medium"
            onClick={handleBack}
            className="h-10 px-2"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="solid"
            color="primary"
            size="medium"
            disabled={isPlacingOrder}
            onClick={handlePlaceOrder}
            className="h-10 px-8"
          >
            {isPlacingOrder ? 'Placing...' : 'Place order'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatBirthDateForApi(dateOfBirth: string) {
  const normalizedDate = dateOfBirth.trim();

  const isoDateMatch = normalizedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return isValidDateParts(year, month, day) ? normalizedDate : null;
  }

  const slashDateMatch = normalizedDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashDateMatch) {
    const [, month, day, year] = slashDateMatch;
    return isValidDateParts(year, month, day) ? `${year}-${month}-${day}` : null;
  }

  return null;
}

function isValidDateParts(yearText: string, monthText: string, dayText: string) {
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function getDepositDeadlineAt() {
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 24);
  return deadline.toISOString();
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-weak1 px-4 py-3 last:border-b-0">
      <span className="text-text-weak font-roboto text-[14px] font-normal leading-5 tracking-[0.25px]">{label}</span>
      <span
        className={`text-right font-roboto text-[16px] leading-6 tracking-[0.5px] ${
          strong ? 'text-text-default font-medium' : 'text-text-default font-normal'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
