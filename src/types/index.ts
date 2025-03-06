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

export interface OauthRequest {
  oAuthUid: string | number;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}
