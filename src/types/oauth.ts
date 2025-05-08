export interface OauthRequest {
  oAuthUid: string | number;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}
