import type { CounselorAvailabilitySlot } from '@/services/counselorService';
import { parseUtcDateTime } from '@/utils/utcDateTime';

interface TimeSlotPickerProps {
  availableSlots?: CounselorAvailabilitySlot[];
  selectedDate: Date | null;
  selectedSlots: string[];
  onSlotsChange: (slots: string[]) => void;
}

const generateTimeSlots = () => {
  const slots: string[] = [];

  for (let hour = 7; hour <= 23; hour++) {
    slots.push(formatTimeSlot(hour, 0));
    slots.push(formatTimeSlot(hour, 30));
  }
  slots.push(formatTimeSlot(0, 0));

  return slots;
};

const formatTimeSlot = (hour: number, minute: 0 | 30) => {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export function TimeSlotPicker({ availableSlots, selectedDate, selectedSlots, onSlotsChange }: TimeSlotPickerProps) {
  const timeSlots = availableSlots ? mapAvailableSlotsToTimeSlots(availableSlots, selectedDate) : generateTimeSlots();

  const handleSlotClick = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      // Remove the slot
      onSlotsChange(selectedSlots.filter((s) => s !== slot));
    } else {
      // Add the slot
      onSlotsChange([...selectedSlots, slot]);
    }
  };

  const formatDate = (date: Date) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="flex w-full px-4 flex-col items-start gap-3 rounded-b-lg border border-t-0 border-border-default overflow-x-auto">
      <div className="text-text-default font-roboto text-[14px] font-normal leading-5 tracking-[0.25px]">
        {selectedDate ? `Select time for ${formatDate(selectedDate)}` : 'Select a date first'}
      </div>
      <div className="flex w-full items-center gap-2 flex-wrap pb-4">
        {timeSlots.map((slot) => {
          const label = typeof slot === 'string' ? slot : slot.label;
          const isDisabled = typeof slot !== 'string' && slot.status !== 'AVAILABLE';
          const isSelected = selectedSlots.includes(label);
          const isFirstSelected = selectedSlots[0] === label && selectedSlots.length === 1;

          return (
            <button
              key={label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSlotClick(label)}
              disabled={!selectedDate || isDisabled}
              className={`flex h-[30px] px-3 flex-col justify-center items-center gap-2 rounded-lg border transition-colors ${
                isFirstSelected
                  ? 'border-border-brand-default bg-bg-highlight-selected'
                  : isSelected
                    ? 'border-border-brand-default bg-bg-brand-default'
                    : 'border-border-default bg-white'
              } ${!selectedDate || isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex h-[22px] justify-center items-center gap-1 flex-shrink-0">
                <div
                  className={`text-center font-roboto text-[12px] font-medium leading-4 ${
                    isFirstSelected ? 'text-text-brand-default' : isSelected ? 'text-white' : 'text-text-default'
                  }`}
                >
                  {label}
                </div>
                {isFirstSelected && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.6667 4.27334L11.7267 3.33334L8.00004 7.06001L4.27337 3.33334L3.33337 4.27334L7.06004 8.00001L3.33337 11.7267L4.27337 12.6667L8.00004 8.94001L11.7267 12.6667L12.6667 11.7267L8.94004 8.00001L12.6667 4.27334Z"
                      fill="#222222"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
        {availableSlots && timeSlots.length === 0 && (
          <div className="text-text-weak font-roboto text-[14px] leading-5">No available times for this date.</div>
        )}
      </div>
    </div>
  );
}

function mapAvailableSlotsToTimeSlots(availableSlots: CounselorAvailabilitySlot[], selectedDate: Date | null) {
  if (!selectedDate) return [];

  return availableSlots
    .map((slot) => {
      const date = parseUtcDateTime(slot.slotStartUtc);
      return {
        label: formatTimeForDisplay(date),
        localDateKey: formatDateKey(date),
        status: slot.status,
      };
    })
    .filter((slot) => slot.localDateKey === formatDateKey(selectedDate));
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
