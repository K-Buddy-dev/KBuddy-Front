import { authClient } from '@/api/axiosConfig';

export interface RegisterCounselorAvailabilityRequest {
  endDate: string;
  endTime: string;
  startDate: string;
  startTime: string;
}

export interface RegisterCounselorProfileResponse {
  id?: number | string;
  counselorId?: number | string;
  data?: {
    id?: number | string;
    counselorId?: number | string;
  } | null;
}

export interface MyCounselorPromotion {
  active: boolean;
  endDate: string;
  promotionalPrice: number;
  promotionSessionMinutes: number;
  startDate: string;
}

export interface CounselorPromotion {
  isActive?: boolean;
  active?: boolean;
  endDate: string;
  promotionalPrice: number;
  promotionSessionMinutes: number;
  startDate: string;
}

export interface MyCounselorReview {
  comment: string;
  createdAt: string;
  customerName: string;
  id: number;
  rating: number;
}

export interface CounselorReview {
  comment: string;
  createdAt: string;
  customerName: string;
  id?: number;
  reviewId?: number;
  rating: number;
}

export interface CounselorListItem {
  categories: string[];
  counselorId: string | number;
  counselorUserUuid?: string | number;
  coverImageUrl?: string;
  hasPromotion: boolean;
  name: string;
  ratingAvg: number;
  regularPrice: number;
  reviewCount: number;
  sessionMinutes: number;
  title: string;
}

export interface CounselorListResponse {
  content: CounselorListItem[];
  totalElements: number;
}

export interface CounselorDetail {
  categories: string[];
  counselorId?: string | number;
  counselorUserUuid?: string | number;
  coverImageUrl?: string;
  detail: string;
  inquiries?: CounselorInquiryListItem[];
  inquiry?: CounselorInquiryListResponse | CounselorInquiryListItem[];
  inquiryCount?: number;
  intro?: string;
  name: string;
  photoUrls?: string[];
  professionalBackground?: string;
  profileImageUrl?: string;
  promotion?: CounselorPromotion;
  proofFileUrl?: string;
  ratingAvg?: number;
  recentInquiries?: CounselorInquiryListItem[];
  recentReviews: CounselorReview[];
  regularPrice: number;
  reviewCount: number;
  sessionMinutes: number;
  timezone: string;
  title: string;
}

export type MyCounselorProfile = CounselorDetail & { id: string };

export interface CounselorAvailabilitySlot {
  availabilityId?: number | string;
  slotStartUtc: string;
  status: 'AVAILABLE' | 'BOOKED' | string;
}

export interface CounselorAvailabilityResponse {
  slots: CounselorAvailabilitySlot[];
}

export interface CounselorReviewListResponse {
  reviews: CounselorReview[];
  totalCount: number;
}

export interface CounselorInquiryListItem {
  createdAt: string;
  hasReply?: boolean;
  inquiryId: number;
  isSecret: boolean;
  replyCount?: number;
  title: string;
  writerName: string;
}

export interface CounselorInquiryListResponse {
  inquiries: CounselorInquiryListItem[];
  totalCount: number;
}

export interface CounselorInquiryReply {
  authorName: string;
  content: string;
  createdAt: string;
  replyId: number;
}

export interface CounselorInquiryDetail {
  content: string;
  createdAt: string;
  inquiryId: number;
  isSecret: boolean;
  replies: CounselorInquiryReply[];
  title: string;
  writerName: string;
}

export interface CreateCounselorInquiryRequest {
  content: string;
  isSecret?: boolean;
  title: string;
}

type MyCounselorProfileResponse = MyCounselorProfile | { data: MyCounselorProfile };
type CounselorListApiResponse = CounselorListResponse | { data: CounselorListResponse };
type CounselorDetailApiResponse = CounselorDetail | { data: CounselorDetail };
type CounselorAvailabilityApiResponse = CounselorAvailabilityResponse | { data: CounselorAvailabilityResponse };
type CounselorReviewListApiResponse = CounselorReviewListResponse | { data: CounselorReviewListResponse };
type CounselorInquiryListApiResponse = CounselorInquiryListResponse | { data: CounselorInquiryListResponse };
type CounselorInquiryDetailApiResponse = CounselorInquiryDetail | { data: CounselorInquiryDetail };

function unwrapData<T>(response: T | { data: T }): T {
  return response && typeof response === 'object' && 'data' in response ? response.data : response;
}

function normalizeCounselorDetail(profile: CounselorDetail | MyCounselorProfile): MyCounselorProfile {
  const counselorId = String(('id' in profile ? profile.id : profile.counselorId) || '');

  return {
    ...profile,
    id: counselorId,
    counselorId,
    counselorUserUuid: profile.counselorUserUuid ? String(profile.counselorUserUuid) : undefined,
    categories: Array.isArray(profile.categories) ? profile.categories : [],
    inquiries: getProfileInquiries(profile).items,
    inquiryCount: getProfileInquiries(profile).totalCount,
    photoUrls: Array.isArray(profile.photoUrls) ? profile.photoUrls : [],
    ratingAvg: typeof profile.ratingAvg === 'number' ? profile.ratingAvg : 0,
    recentInquiries: Array.isArray(profile.recentInquiries) ? profile.recentInquiries : [],
    recentReviews: Array.isArray(profile.recentReviews) ? profile.recentReviews : [],
  };
}

export function getProfileInquiries(profile: CounselorDetail | MyCounselorProfile): {
  items: CounselorInquiryListItem[];
  totalCount: number;
} {
  const inquiryField = profile.inquiry;
  const items = Array.isArray(profile.inquiries)
    ? profile.inquiries
    : Array.isArray(profile.recentInquiries)
      ? profile.recentInquiries
      : Array.isArray(inquiryField)
        ? inquiryField
        : inquiryField && Array.isArray(inquiryField.inquiries)
          ? inquiryField.inquiries
          : [];

  const totalCount =
    typeof profile.inquiryCount === 'number'
      ? profile.inquiryCount
      : inquiryField && !Array.isArray(inquiryField) && typeof inquiryField.totalCount === 'number'
        ? inquiryField.totalCount
        : items.length;

  return { items, totalCount };
}

export const counselorService = {
  getCounselors: async ({
    category,
    page = 0,
    size = 20,
    sort,
  }: { category?: string; page?: number; size?: number; sort?: string } = {}): Promise<CounselorListResponse> => {
    const response = await authClient.get<CounselorListApiResponse>('/counselor', {
      params: {
        ...(category ? { category } : {}),
        page,
        size,
        ...(sort ? { sort } : {}),
      },
    });
    const result = unwrapData(response.data);

    return {
      content: Array.isArray(result.content)
        ? result.content.map((item) => ({
            ...item,
            counselorId: String(item.counselorId),
            counselorUserUuid: item.counselorUserUuid ? String(item.counselorUserUuid) : undefined,
          }))
        : [],
      totalElements: typeof result.totalElements === 'number' ? result.totalElements : 0,
    };
  },

  getCounselorDetail: async (counselorId: string): Promise<MyCounselorProfile> => {
    const response = await authClient.get<CounselorDetailApiResponse>(`/counselor/${counselorId}`);
    return normalizeCounselorDetail(unwrapData(response.data));
  },

  getMyProfile: async (): Promise<MyCounselorProfile> => {
    const response = await authClient.get<MyCounselorProfileResponse>('/counselor/me');
    return normalizeCounselorDetail(unwrapData(response.data));
  },

  getCounselorAvailability: async (
    counselorId: string,
    { year, month }: { year: number; month: number }
  ): Promise<CounselorAvailabilityResponse> => {
    const response = await authClient.get<CounselorAvailabilityApiResponse>(`/counselor/${counselorId}/availability`, {
      params: { year, month },
    });
    const result = unwrapData(response.data);

    return {
      slots: Array.isArray(result.slots) ? result.slots : [],
    };
  },

  getCounselorReviews: async (
    counselorId: string,
    { page = 0, size = 20 }: { page?: number; size?: number } = {}
  ): Promise<CounselorReviewListResponse> => {
    const response = await authClient.get<CounselorReviewListApiResponse>(`/counselor/${counselorId}/review`, {
      params: { page, size },
    });
    const result = unwrapData(response.data);

    return {
      reviews: Array.isArray(result.reviews) ? result.reviews : [],
      totalCount: typeof result.totalCount === 'number' ? result.totalCount : 0,
    };
  },

  getCounselorInquiries: async (
    counselorId: string,
    { page = 0, size = 20 }: { page?: number; size?: number } = {}
  ): Promise<CounselorInquiryListResponse> => {
    const response = await authClient.get<CounselorInquiryListApiResponse>(`/counselor/${counselorId}/inquiry`, {
      params: { page, size },
    });
    const result = unwrapData(response.data);

    return {
      inquiries: Array.isArray(result.inquiries) ? result.inquiries : [],
      totalCount: typeof result.totalCount === 'number' ? result.totalCount : 0,
    };
  },

  getCounselorInquiryDetail: async (counselorId: string, inquiryId: number): Promise<CounselorInquiryDetail> => {
    const response = await authClient.get<CounselorInquiryDetailApiResponse>(
      `/counselor/${counselorId}/inquiry/${inquiryId}`
    );
    const result = unwrapData(response.data);

    return {
      ...result,
      replies: Array.isArray(result.replies) ? result.replies : [],
    };
  },

  createCounselorInquiry: async (counselorId: string, request: CreateCounselorInquiryRequest): Promise<void> => {
    await authClient.post(`/counselor/${counselorId}/inquiry`, request);
  },

  replyToCounselorInquiry: async (counselorId: string, inquiryId: number, content: string): Promise<void> => {
    await authClient.post(`/counselor/${counselorId}/inquiry/${inquiryId}/reply`, { content });
  },

  deleteProfile: async (): Promise<void> => {
    await authClient.delete('/counselor');
  },

  registerProfile: async (formData: FormData): Promise<number | string | null> => {
    const response = await authClient.post<RegisterCounselorProfileResponse>('/counselor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const nestedData = response.data.data && typeof response.data.data === 'object' ? response.data.data : undefined;
    const counselorId = response.data.id ?? response.data.counselorId ?? nestedData?.id ?? nestedData?.counselorId;

    return counselorId ?? null;
  },

  updateProfile: async (formData: FormData): Promise<void> => {
    await authClient.patch('/counselor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
