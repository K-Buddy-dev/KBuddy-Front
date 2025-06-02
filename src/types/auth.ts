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
  country: string;
  gender: string;
  oAuthUid?: string | number;
  oAuthCategory?: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password?: string;
  birthDate: string;
  country: string;
  gender: string;
  oAuthUid?: string | number;
  oAuthCategory?: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface UserIdCheckRequest {
  userId: string;
}

export interface LoginRequest {
  emailOrUserId: string;
  password: string;
}

export interface EmailVerifyRequest {
  email: string;
}

export interface SendCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}
