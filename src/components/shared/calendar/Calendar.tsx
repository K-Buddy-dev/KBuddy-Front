import { useState } from 'react';

interface CalendarProps {
  highlightedDates?: Date[];
  selectedDate: Date | null;
  selectedRangeEnd?: Date | null;
  selectedRangeStart?: Date | null;
  onDateSelect: (date: Date) => void;
}

export function Calendar({
  highlightedDates = [],
  selectedDate,
  selectedRangeEnd,
  selectedRangeStart,
  onDateSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

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
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    // We need Monday to be 0, so we adjust
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday becomes 6

    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(startDayOfWeek).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return { weeks, month, year };
  };

  const { weeks, month, year } = getMonthData(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    onDateSelect(newDate);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const isSameCalendarDay = (date: Date, day: number) =>
    day === date.getDate() && month === date.getMonth() && year === date.getFullYear();

  const isRangeBoundary = (day: number) =>
    Boolean(
      (selectedRangeStart && isSameCalendarDay(selectedRangeStart, day)) ||
        (selectedRangeEnd && isSameCalendarDay(selectedRangeEnd, day))
    );

  const isHighlighted = (day: number) => highlightedDates.some((date) => isSameCalendarDay(date, day));

  const isInSelectedRange = (day: number) => {
    if (!selectedRangeStart || !selectedRangeEnd) return false;

    const rangeStart = new Date(selectedRangeStart);
    const rangeEnd = new Date(selectedRangeEnd);
    const checkDate = new Date(year, month, day);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate >= rangeStart && checkDate <= rangeEnd;
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  return (
    <div className="flex flex-col items-start w-full">
      {/* Month navigation */}
      <div className="flex w-full h-14 px-4 justify-between items-center rounded-t-lg border border-border-default bg-white">
        <button type="button" onClick={handlePreviousMonth} className="flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.705 7.41L14.295 6L8.29504 12L14.295 18L15.705 16.59L11.125 12L15.705 7.41Z" fill="#B1B1B1" />
          </svg>
        </button>
        <div className="text-text-default font-roboto text-[16px] font-medium leading-6 tracking-[0.15px]">
          {monthNames[month]} {year}
        </div>
        <button type="button" onClick={handleNextMonth} className="flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.70504 6L8.29504 7.41L12.875 12L8.29504 16.59L9.70504 18L15.705 12L9.70504 6Z" fill="#222222" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex w-full p-2 flex-col justify-center items-center border border-t-0 border-border-default">
        <div className="flex flex-col items-start self-stretch rounded overflow-hidden">
          {/* Day names */}
          <div className="flex items-start self-stretch">
            {dayNames.map((day) => (
              <div key={day} className="flex flex-col items-start flex-1 self-stretch">
                <div className="flex py-2.5 justify-center items-center self-stretch overflow-hidden">
                  <div className="flex-1 text-text-default text-center font-roboto text-[14px] font-medium leading-5 tracking-[0.1px]">
                    {day}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex items-start self-stretch">
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="flex flex-col items-start flex-1 self-stretch">
                  <div
                    className={`flex py-2.5 px-3 items-start self-stretch overflow-hidden relative ${
                      day && isInSelectedRange(day) ? 'bg-bg-highlight-selected' : ''
                    } ${day && isHighlighted(day) && !isInSelectedRange(day) ? 'bg-bg-highlight-hover' : ''}`}
                  >
                    {day && (
                      <>
                        {(isSelected(day) || isRangeBoundary(day)) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="12" r="12" fill="#6952F9" />
                            </svg>
                          </div>
                        )}
                        <button
                          type="button"
                          aria-pressed={isSelected(day) || isInSelectedRange(day)}
                          onClick={() => !isPastDate(day) && handleDateClick(day)}
                          disabled={isPastDate(day)}
                          className={`flex-1 text-center font-roboto text-[12px] font-medium leading-4 tracking-[0.5px] relative z-10 ${
                            isSelected(day) || isRangeBoundary(day)
                              ? 'text-white'
                              : isPastDate(day)
                                ? 'text-text-disabled cursor-not-allowed'
                                : 'text-text-default cursor-pointer'
                          }`}
                        >
                          {day}
                        </button>
                        {isHighlighted(day) && !isSelected(day) && !isRangeBoundary(day) && (
                          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-bg-brand-default" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
