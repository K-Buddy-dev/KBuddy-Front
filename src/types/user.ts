export interface LoginFormData {
  emailOrUserId: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password?: string;
  confirmPassword?: string;
  birthDate: { year: string; month: string; day: string };
  country?: string | null;
  gender: string;
  oAuthUid?: string | number;
  oAuthCategory?: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface ProfileEditFormData {
  userId?: string;
  profileImage?: File | null;
  bio?: string | null;
}

export interface BasicUserData {
  userId: string;
  profileImageUrl: string | null;
  bio: string | null;
}

export interface User extends BasicUserData {
  country: string;
  createdDate: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  isActive: boolean;
  lastName: string;
  profileImageUrl: string | null;
  roles: string[];
  userId: string;
}
