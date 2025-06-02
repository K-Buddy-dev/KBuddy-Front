interface EmailRequestBase {
  email: string;
}

export interface EmailVerifyRequest extends EmailRequestBase {}

export interface SendCodeRequest extends EmailRequestBase {}

export interface VerifyCodeRequest extends EmailRequestBase {
  code: string;
}

export interface UserIdCheckRequest {
  userId: string;
}

interface SignupBase {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password?: string;
  country: string;
  gender: string;
  oAuthUid?: string | number;
  oAuthCategory?: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface SignupFormData extends SignupBase {
  confirmPassword?: string;
  birthDate: { year: string; month: string; day: string };
}

export interface SignupRequest extends SignupBase {
  birthDate: string;
}

interface ProfileDataBase {
  userId: string;
  bio: string | null;
}

export interface ProfileEditFormData extends Partial<ProfileDataBase> {
  profileImage?: File | null;
}

export interface BasicUserData extends ProfileDataBase {
  profileImageUrl: string | null;
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
  roles: string[];
}
