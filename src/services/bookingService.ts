import { authClient } from '@/api/axiosConfig';

export interface BookingReserveRequest {
  birthDate: string;
  counselorId: string;
  slotIds: number[];
  topic: string;
}

export interface BookingReserveResponse {
  bookingEndUtc: string;
  bookingId: number;
  bookingStartUtc: string;
  holdExpiresAt: string;
  slotCount: number;
  status: 'PENDING' | string;
  totalPrice: number;
}

export interface MyBooking {
  bookingEndUtc?: string;
  bookingId: number;
  counselorCoverImageUrl?: string;
  counselorId?: number | string;
  bookingStartUtc?: string;
  counselorName?: string;
  counselorUsername?: string;
  serviceTitle?: string;
  status: string;
  title?: string;
  topic?: string;
  totalPrice?: number;
}

export interface CounselorBooking {
  birthDate?: string;
  bookingEndUtc?: string;
  bookingId: number;
  bookingStartUtc?: string;
  customerName?: string;
  customerUsername?: string;
  status: string;
  topic?: string;
  totalPrice?: number;
}

type BookingReserveApiResponse = BookingReserveResponse | { data: BookingReserveResponse };
type BookingListApiResponse<T> =
  | T[]
  | {
      bookings?: T[];
      content?: T[];
      data?: T[] | { bookings?: T[]; content?: T[] };
      totalElements?: number;
    };

function unwrapData<T>(response: T | { data: T }): T {
  return response && typeof response === 'object' && 'data' in response ? response.data : response;
}

function normalizeBookings<T>(response: BookingListApiResponse<T>): T[] {
  if (Array.isArray(response)) return response;

  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return data.bookings ?? data.content ?? [];

  return response.bookings ?? response.content ?? [];
}

export const bookingService = {
  reserve: async (request: BookingReserveRequest): Promise<BookingReserveResponse> => {
    const response = await authClient.post<BookingReserveApiResponse>('/booking/reserve', request);
    return unwrapData(response.data);
  },
  getMyBookings: async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}): Promise<MyBooking[]> => {
    const response = await authClient.get<BookingListApiResponse<MyBooking>>('/booking/my', {
      params: {
        page,
        size,
      },
    });
    return normalizeBookings(response.data);
  },
  getCounselorBookings: async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}): Promise<
    CounselorBooking[]
  > => {
    const response = await authClient.get<BookingListApiResponse<CounselorBooking>>('/booking/counselor', {
      params: {
        page,
        size,
      },
    });
    return normalizeBookings(response.data);
  },
};
