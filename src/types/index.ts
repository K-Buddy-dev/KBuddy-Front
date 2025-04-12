export * from './blog';
export * from './post';
export * from './qna';

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

export type TransitionState = 'current' | 'animating';
export type TransitionDirection = 'left' | 'right';

export interface Activity {
  key: string;
  element: React.ReactNode;
  transition?: TransitionState;
  direction?: TransitionDirection;
}
