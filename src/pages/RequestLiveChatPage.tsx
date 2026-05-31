import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Topbar } from '@/components/shared/topbar/Topbar';
import { Button } from '@/components/shared/button/Button';
import { TextField } from '@/components/shared/text-field/TextField';
import { Label } from '@/components/shared/label/Label';
import { StepIndicator } from '@/components/shared/step-indicator/StepIndicator';
import { Calendar } from '@/components/shared/calendar/Calendar';
import { TimeSlotPicker } from '@/components/shared/time-slot-picker/TimeSlotPicker';
import { requestLiveChatSchema, RequestLiveChatData } from '@/utils/validationSchemas';
import { counselorService, CounselorAvailabilitySlot } from '@/services/counselorService';
import { authService } from '@/services/authService';
import { parseUtcDateTime } from '@/utils/utcDateTime';
import { analyticsService } from '@/services/analyticsService';
import { analyticsEvents } from '@/services/analyticsEvents';

type SavedLiveChatRequest = Omit<RequestLiveChatData, 'selectedDate'> & {
  selectedDate: string;
  slotIds?: number[];
};

export function RequestLiveChatPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const savedRequest = useMemo(() => getSavedLiveChatRequest(id), [id]);
  const defaultDate = savedRequest ? new Date(savedRequest.selectedDate) : new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
  const [availabilitySlots, setAvailabilitySlots] = useState<CounselorAvailabilitySlot[]>([]);
  const [availabilityError, setAvailabilityError] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RequestLiveChatData>({
    resolver: zodResolver(requestLiveChatSchema),
    defaultValues: {
      firstName: savedRequest?.firstName ?? '',
      lastName: savedRequest?.lastName ?? '',
      dateOfBirth: savedRequest?.dateOfBirth ?? '',
      selectedDate: defaultDate,
      timeSlots: savedRequest?.timeSlots ?? [],
      topic: savedRequest?.topic ?? '',
    },
    mode: 'onChange',
  });

  const steps = [
    { label: 'Request live chat', status: 'current' as const },
    { label: 'Confirm order', status: 'disabled' as const },
    { label: 'Order placed', status: 'disabled' as const },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setValue('selectedDate', date, { shouldValidate: true });
    setValue('timeSlots', [], { shouldValidate: true });
  };

  const topic = watch('topic') || '';
  const selectedTimeSlots = watch('timeSlots') || [];
  const selectedSlotIds = useMemo(
    () => getSelectedAvailabilityIds(availabilitySlots, selectedDate, selectedTimeSlots),
    [availabilitySlots, selectedDate, selectedTimeSlots]
  );
  const highlightedAvailabilityDates = useMemo(
    () => getAvailableDatesFromSlots(availabilitySlots),
    [availabilitySlots]
  );

  useEffect(() => {
    if (savedRequest) return;

    const applyUserProfileToForm = (
      userProfile: Partial<{
        birthDate: string | null;
        firstName: string;
        lastName: string;
      }>
    ) => {
      reset((currentValues) => ({
        ...currentValues,
        dateOfBirth: formatBirthDateForDisplay(userProfile.birthDate),
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
      }));
    };

    const cachedUserProfile = getCachedBasicUserData();
    if (hasRequesterProfileFields(cachedUserProfile)) {
      applyUserProfileToForm(cachedUserProfile);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        const userProfile = response.data;
        localStorage.setItem('basicUserData', JSON.stringify(userProfile));
        applyUserProfileToForm(userProfile);
      } catch (error) {
        console.error('Failed to load user profile for live chat request:', error);
      }
    };

    fetchUserProfile();
  }, [reset, savedRequest]);

  useEffect(() => {
    if (!id || !selectedDate) return;

    const fetchAvailability = async () => {
      setAvailabilityError('');

      try {
        const result = await counselorService.getCounselorAvailability(id, {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
        });
        setAvailabilitySlots(result.slots);
      } catch (error) {
        console.error(error);
        setAvailabilitySlots([]);
        setAvailabilityError('Unable to load available times.');
      }
    };

    fetchAvailability();
  }, [id, selectedDate?.getFullYear(), selectedDate?.getMonth()]);

  const onSubmit = (data: RequestLiveChatData) => {
    const request = {
      ...data,
      selectedDate: data.selectedDate.toISOString(),
      slotIds: selectedSlotIds,
    };

    saveLiveChatRequest(id, request);
    analyticsService.trackEvent(analyticsEvents.bookingRequestSubmitted, {
      counselor_id: id,
      selected_slot_count: selectedSlotIds.length,
      topic_length: data.topic.trim().length,
    });
    navigate(`/service/${id}/request/confirm`, {
      state: {
        request,
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-bg-default pb-32">
      <Topbar title="Request live chat" type="cancel" onCancle={handleClose} />

      {/* Step Indicator */}
      <div className="mt-[72px]">
        <StepIndicator steps={steps} currentStep={0} />
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="inline-flex px-4 pb-[136px] pt-0 flex-col items-start gap-6 w-full"
      >
        {/* General Info Section */}
        <div className="flex flex-col items-start w-full">
          <div className="flex w-full py-6 pb-4 items-center gap-1">
            <div className="flex flex-col items-start gap-1 flex-1">
              <div className="flex items-end gap-1 self-stretch">
                <h2 className="flex-1 text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
                  General Info
                </h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 w-full">
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <TextField id="firstName" label="First name" {...field} error={errors.firstName?.message} />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <TextField id="lastName" label="Last name" {...field} error={errors.lastName?.message} />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <div className="w-full flex flex-col items-start">
                  <div className="flex items-start self-stretch mb-2">
                    <div className="flex h-5 items-center gap-0.5 flex-1">
                      <div className="flex items-center content-center gap-2 flex-wrap">
                        <Label htmlFor="dateOfBirth" label="Date of birth" />
                      </div>
                      <div className="flex w-4 h-4 p-[1.333px] justify-center items-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M6 10.6667H7.33333V9.33333H6V10.6667ZM6.66667 0C2.98667 0 0 2.98667 0 6.66667C0 10.3467 2.98667 13.3333 6.66667 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66667 0ZM6.66667 12C3.72667 12 1.33333 9.60667 1.33333 6.66667C1.33333 3.72667 3.72667 1.33333 6.66667 1.33333C9.60667 1.33333 12 3.72667 12 6.66667C12 9.60667 9.60667 12 6.66667 12ZM6.66667 2.66667C5.19333 2.66667 4 3.86 4 5.33333H5.33333C5.33333 4.6 5.93333 4 6.66667 4C7.4 4 8 4.6 8 5.33333C8 6.66667 6 6.5 6 8.66667H7.33333C7.33333 7.16667 9.33333 7 9.33333 5.33333C9.33333 3.86 8.14 2.66667 6.66667 2.66667Z"
                            fill="#222222"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex px-4 pr-2 py-3 items-start gap-2 self-stretch rounded-lg border border-border-default bg-white">
                    <input
                      id="dateOfBirth"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="MM/DD/YYYY"
                      type="text"
                      className="flex-1 self-stretch text-text-default font-roboto text-[16px] font-normal leading-6 tracking-[0.5px] outline-none bg-transparent"
                      {...field}
                      onChange={(event) => field.onChange(formatDateInput(event.currentTarget.value))}
                    />
                  </div>
                  {errors.dateOfBirth?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-weak1" />

        {/* Date and Time Section */}
        <div className="flex flex-col items-start w-full">
          <div className="flex w-full py-6 pb-4 items-center gap-1">
            <div className="flex flex-col items-start gap-1 flex-1">
              <div className="flex items-end gap-1 self-stretch">
                <h2 className="flex-1 text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
                  Date and Time
                </h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start w-full">
            <Calendar
              highlightedDates={highlightedAvailabilityDates}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
            <Controller
              control={control}
              name="timeSlots"
              render={({ field }) => (
                <TimeSlotPicker
                  availableSlots={availabilitySlots}
                  selectedDate={selectedDate}
                  selectedSlots={field.value || []}
                  onSlotsChange={field.onChange}
                />
              )}
            />
            {availabilityError && <p className="text-text-danger-default text-[12px] mt-2">{availabilityError}</p>}
            {errors.timeSlots && (
              <p className="text-text-danger-default text-[12px] mt-2">{errors.timeSlots.message}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-weak1" />

        {/* Live Chat Topic Section */}
        <div className="flex flex-col items-start w-full">
          <div className="flex w-full py-6 pb-4 items-center gap-1">
            <div className="flex flex-col items-start gap-1 flex-1">
              <div className="flex items-end gap-1 self-stretch">
                <h2 className="flex-1 text-text-default font-roboto text-[18px] font-medium leading-6 tracking-[0.15px]">
                  Live chat topic
                </h2>
              </div>
              <div className="flex items-start gap-2 self-stretch">
                <div className="flex-1 text-text-default font-roboto text-[16px] font-normal leading-6 tracking-[0.5px]">
                  Please write your live chat topic request below to help our consultant better prepare and provide
                  accurate assistance during your session.
                </div>
              </div>
            </div>
          </div>

          <Controller
            control={control}
            name="topic"
            render={({ field }) => (
              <div className="flex w-full flex-col items-end gap-2">
                <div className="flex h-[150px] flex-col items-start gap-2.5 self-stretch rounded-lg border border-border-default bg-white relative">
                  <div className="flex w-full h-[150px] p-3 flex-col items-start gap-1 flex-shrink-0 rounded-t overflow-y-auto">
                    <textarea
                      id="topic"
                      className="self-stretch text-text-default font-roboto text-[16px] font-normal leading-6 tracking-[0.5px] outline-none bg-transparent resize-none h-full"
                      placeholder="Tap here to start writing"
                      maxLength={300}
                      {...field}
                    />
                  </div>
                  <div
                    className="absolute right-2 top-2 w-[3px] h-[60px] rounded-full"
                    style={{ background: 'rgba(5, 0, 39, 0.20)' }}
                  />
                </div>
                <div className="flex w-full justify-end pr-3">
                  <div className="flex h-3 min-w-[42px] items-center justify-end">
                    <div className="text-text-example text-right font-roboto text-[12px] font-medium leading-3 tracking-[0.24px]">
                      {topic.length}/300
                    </div>
                  </div>
                </div>
                {errors.topic && <p className="text-text-danger-default text-[12px] mt-1">{errors.topic.message}</p>}
              </div>
            )}
          />
        </div>
      </form>

      {/* Bottom Navigation Bar */}
      <div
        data-testid="request-action-bar"
        className="fixed bottom-0 left-1/2 flex h-20 min-w-[280px] w-full -translate-x-1/2 items-start border-t border-border-weak1 bg-white sm:w-[600px]"
      >
        <div className="flex w-full px-4 pt-3 justify-between items-center">
          <Button
            type="button"
            variant="link"
            color="secondary"
            size="medium"
            onClick={handleBack}
            disabled
            className="h-10 px-2"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            size="medium"
            onClick={handleSubmit(onSubmit)}
            className="h-10 px-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function getSelectedAvailabilityIds(
  availabilitySlots: CounselorAvailabilitySlot[],
  selectedDate: Date | null,
  selectedTimeSlots: string[]
) {
  if (!selectedDate) return [];

  return availabilitySlots
    .filter((slot) => slot.status === 'AVAILABLE')
    .filter((slot) => formatDateKey(parseUtcDateTime(slot.slotStartUtc)) === formatDateKey(selectedDate))
    .filter((slot) => selectedTimeSlots.includes(formatTimeForDisplay(parseUtcDateTime(slot.slotStartUtc))))
    .map((slot) => Number(slot.availabilityId))
    .filter((availabilityId) => Number.isFinite(availabilityId));
}

function getLiveChatRequestStorageKey(counselorId?: string) {
  return `liveChatRequest:${counselorId || 'unknown'}`;
}

function getSavedLiveChatRequest(counselorId?: string): SavedLiveChatRequest | null {
  const savedRequest = sessionStorage.getItem(getLiveChatRequestStorageKey(counselorId));
  if (!savedRequest) return null;

  try {
    const parsedRequest = JSON.parse(savedRequest) as SavedLiveChatRequest;
    if (!parsedRequest.selectedDate || Number.isNaN(new Date(parsedRequest.selectedDate).getTime())) {
      return null;
    }
    return parsedRequest;
  } catch {
    return null;
  }
}

function saveLiveChatRequest(counselorId: string | undefined, request: SavedLiveChatRequest) {
  sessionStorage.setItem(getLiveChatRequestStorageKey(counselorId), JSON.stringify(request));
}

function getAvailableDatesFromSlots(availabilitySlots: CounselorAvailabilitySlot[]) {
  const datesByKey = new Map<string, Date>();

  availabilitySlots
    .filter((slot) => slot.status === 'AVAILABLE')
    .forEach((slot) => {
      const localDate = parseUtcDateTime(slot.slotStartUtc);
      datesByKey.set(
        formatDateKey(localDate),
        new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
      );
    });

  return Array.from(datesByKey.values());
}

function formatTimeForDisplay(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCachedBasicUserData() {
  const cachedUserProfile = localStorage.getItem('basicUserData');
  if (!cachedUserProfile) return null;

  try {
    return JSON.parse(cachedUserProfile) as {
      birthDate?: string | null;
      firstName?: string;
      lastName?: string;
    };
  } catch {
    return null;
  }
}

function hasRequesterProfileFields(
  userProfile: ReturnType<typeof getCachedBasicUserData>
): userProfile is NonNullable<ReturnType<typeof getCachedBasicUserData>> {
  return Boolean(userProfile?.firstName && userProfile?.lastName && userProfile?.birthDate);
}

function formatBirthDateForDisplay(birthDate?: string | null) {
  if (!birthDate) return '';

  const isoDateMatch = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return `${month}/${day}/${year}`;
  }

  return birthDate;
}

function formatDateInput(value: string) {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
  const month = digitsOnly.slice(0, 2);
  const day = digitsOnly.slice(2, 4);
  const year = digitsOnly.slice(4, 8);

  return [month, day, year].filter(Boolean).join('/');
}
