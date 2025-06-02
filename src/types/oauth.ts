export interface OauthRequest {
  oAuthUid: string | number;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface ReactNativeRequest {
  oAuthEmail: string;
  oAuthUid: string | number;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}
