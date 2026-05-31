import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import render from '@/utils/test/render';
import { TimeSlotPicker } from './TimeSlotPicker';

it('renders half-hour time slots from 7 AM through 12 AM', async () => {
  await render(<TimeSlotPicker selectedDate={new Date(2026, 4, 23)} selectedSlots={[]} onSlotsChange={vi.fn()} />);

  expect(screen.getByRole('button', { name: '7:00 AM' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '7:30 AM' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '11:30 PM' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '12:00 AM' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '12:30 AM' })).not.toBeInTheDocument();
});
