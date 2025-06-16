import axios from 'axios';
import { z } from 'zod';

import { Spinner } from '@/components/shared/spinner';
import { useOauthRedirectHandler } from '@/hooks';

// Kakao 프로필 및 계정 스키마
const KakaoProfileSchema = z.object({
  nickname: z.string().optional(),
  thumbnail_image_url: z.string().url().optional(),
  profile_image_url: z.string().url().optional(),
  is_default_image: z.boolean(),
  is_default_nickname: z.boolean(),
});

const KakaoAccountSchema = z.object({
  profile_nickname_needs_agreement: z.boolean(),
  profile_image_needs_agreement: z.boolean(),
  profile: KakaoProfileSchema.optional(),
  has_email: z.boolean(),
  email_needs_agreement: z.boolean(),
  is_email_valid: z.boolean(),
  is_email_verified: z.boolean(),
  email: z.string().email(),
});

const KakaoUserResponseSchema = z.object({
  id: z.number(),
  connected_at: z.string().datetime(),
  properties: z.object({
    nickname: z.string().optional(),
    profile_image: z.string().url().optional(),
    thumbnail_image: z.string().url().optional(),
  }),
  kakao_account: KakaoAccountSchema,
});

async function getValidKakaoAccessToken(): Promise<string | null> {
  const accessToken = localStorage.getItem('kakaoAccessToken');
  const refreshToken = localStorage.getItem('kakaoRefreshToken');
  const tokenExpiry = localStorage.getItem('kakaoTokenExpiry');

  if (!refreshToken) {
    console.warn('리프레시 토큰 만료. 재로그인 필요');
    return null;
  }

  if (!accessToken || !tokenExpiry || Date.now() > parseInt(tokenExpiry, 10) - 600000) {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          client_secret: import.meta.env.VITE_KAKAO_SECRET_KEY,
          refresh_token: refreshToken,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } }
      );

      const newAccessToken = response.data.access_token;
      localStorage.setItem('kakaoAccessToken', newAccessToken);
      localStorage.setItem('kakaoTokenExpiry', (Date.now() + response.data.expires_in * 1000).toString());
      if (response.data.refresh_token) {
        localStorage.setItem('kakaoRefreshToken', response.data.refresh_token);
      }
      return newAccessToken;
    } catch (error) {
      console.error('카카오 토큰 갱신 실패:', error);
      return null;
    }
  }
  return accessToken;
}

async function fetchKakaoUserInfo(): Promise<{ oAuthUid: string; email: string } | null> {
  const validatedToken = await getValidKakaoAccessToken();
  if (!validatedToken) {
    console.warn('유효한 액세스 토큰 없음. 로그인 필요');
    return null;
  }
  try {
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${validatedToken}` },
    });
    const userInfo = KakaoUserResponseSchema.parse(userResponse.data);
    return { oAuthUid: userInfo.id.toString(), email: userInfo.kakao_account.email };
  } catch (error) {
    console.error('사용자 정보 요청 실패:', error);
    return null;
  }
}

export function KakaoRedirectPage() {
  const fetchKakaoUserData = async (): Promise<{ email?: string; oAuthUid: string } | null> => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      console.error('인증 코드 없음');
      return null;
    }
    try {
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
          client_secret: import.meta.env.VITE_KAKAO_SECRET_KEY,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      localStorage.setItem('kakaoAccessToken', access_token);
      localStorage.setItem('kakaoRefreshToken', refresh_token);
      localStorage.setItem('kakaoTokenExpiry', (Date.now() + expires_in * 1000).toString());

      return await fetchKakaoUserInfo();
    } catch (error) {
      console.error('카카오 토큰 가져오기 실패:', error);
      return null;
    }
  };

  const { isLoading } = useOauthRedirectHandler({
    provider: 'KAKAO',
    validateSchema: KakaoUserResponseSchema,
    fetchUserData: fetchKakaoUserData,
  });

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
