import { Spinner } from '@/components/shared/spinner';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { useSocialStore } from '@/store';
import { OauthRequest } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

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
  email: z.string().email(), // 이메일만 필수
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
type KakaoUserResponse = z.infer<typeof KakaoUserResponseSchema>;

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

async function fetchKakaoUserInfo(): Promise<KakaoUserResponse | null> {
  const validatedToken = await getValidKakaoAccessToken();

  if (!validatedToken) {
    console.warn('유효한 액세스 토큰 없음. 로그인 필요');
    return null;
  }

  try {
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${validatedToken}` },
    });
    return KakaoUserResponseSchema.parse(userResponse.data);
  } catch (error) {
    console.error('사용자 정보 요청 실패:', error);
    return null;
  }
}

export function KakaoRedirectPage() {
  const navigate = useNavigate();

  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();

  const code = new URL(window.location.href).searchParams.get('code');

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  const setOauthSignupData = (data: KakaoUserResponse) => {
    setEmail(data.kakao_account.email);
    setoAuthUid(data.id);
    setoAuthCategory('KAKAO');
  };

  const fetchKakaoToken = async () => {
    if (!code) {
      console.error('Authorization code not found');
      return;
    }

    try {
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
          client_secret: import.meta.env.VITE_KAKAO_SECRET_KEY,
          code: code,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      localStorage.setItem('kakaoAccessToken', access_token);
      localStorage.setItem('kakaoRefreshToken', refresh_token);
      localStorage.setItem('kakaoTokenExpiry', (Date.now() + expires_in * 1000).toString());

      const userInfo = await fetchKakaoUserInfo();
      if (!userInfo) throw new Error('Failed to fetch user info');

      setOauthSignupData(userInfo);
      setMemberCheckData({ oAuthUid: userInfo.id.toString(), oAuthCategory: 'KAKAO' });
    } catch (error) {
      console.error('Kakao login error:', error instanceof z.ZodError ? error.errors : error);
    }
  };

  useEffect(() => {
    fetchKakaoToken();
  }, []);

  useEffect(() => {
    if (!memberCheckData) return;
    checkMember(memberCheckData)
      .then(setIsMember)
      .catch((error) => console.error('Member check failed:', error));
  }, [memberCheckData]);

  useEffect(() => {
    if (isMember === null) return;

    if (isMember) {
      handleLogin(memberCheckData!);
      socialStoreReset();
    } else {
      navigate('/oauth/signup/form');
    }
  }, [isMember]);

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
