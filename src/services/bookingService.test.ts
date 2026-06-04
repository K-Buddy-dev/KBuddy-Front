import { authClient } from '@/api/axiosConfig';
import { bookingService } from './bookingService';

vi.mock('@/api/axiosConfig', () => ({
  authClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

it('loads my customer bookings from the booking my endpoint', async () => {
  vi.mocked(authClient.get).mockResolvedValue({
    data: {
      content: [
        {
          bookingEndUtc: '2024-01-15T02:00:00Z',
          bookingId: 1,
          bookingStartUtc: '2024-01-15T01:00:00Z',
          counselorCoverImageUrl: 'https://example.com/cover.jpg',
          counselorId: 9,
          counselorName: 'Counselor Hong',
          status: 'PENDING',
          topic: 'Visa question',
          totalPrice: 100000,
        },
      ],
      totalElements: 5,
    },
  });

  const bookings = await bookingService.getMyBookings();

  expect(authClient.get).toHaveBeenCalledWith('/booking/my', {
    params: {
      page: 0,
      size: 10,
    },
  });
  expect(bookings).toEqual([
    {
      bookingEndUtc: '2024-01-15T02:00:00Z',
      bookingId: 1,
      bookingStartUtc: '2024-01-15T01:00:00Z',
      counselorCoverImageUrl: 'https://example.com/cover.jpg',
      counselorId: 9,
      counselorName: 'Counselor Hong',
      status: 'PENDING',
      topic: 'Visa question',
      totalPrice: 100000,
    },
  ]);
});

it('loads counselor bookings from the booking counselor endpoint', async () => {
  vi.mocked(authClient.get).mockResolvedValue({
    data: {
      content: [
        {
          birthDate: '2000-07-24',
          bookingEndUtc: '2024-01-15T02:00:00Z',
          bookingId: 1,
          bookingStartUtc: '2024-01-15T01:00:00Z',
          customerName: '홍길동',
          customerUsername: 'gildong123',
          status: 'PENDING',
          topic: '비자 문의',
          totalPrice: 100000,
        },
      ],
      totalElements: 5,
    },
  });

  const bookings = await bookingService.getCounselorBookings();

  expect(authClient.get).toHaveBeenCalledWith('/booking/counselor', {
    params: {
      page: 0,
      size: 10,
    },
  });
  expect(bookings).toEqual([
    {
      birthDate: '2000-07-24',
      bookingEndUtc: '2024-01-15T02:00:00Z',
      bookingId: 1,
      bookingStartUtc: '2024-01-15T01:00:00Z',
      customerName: '홍길동',
      customerUsername: 'gildong123',
      status: 'PENDING',
      topic: '비자 문의',
      totalPrice: 100000,
    },
  ]);
});
