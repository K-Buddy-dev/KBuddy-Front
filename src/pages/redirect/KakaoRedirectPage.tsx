import { Spinner } from '@/components/shared/spinner';
import { useOauthRedirectHandler } from '@/hooks';
import axios from 'axios';
import { z } from 'zod';

const KakaoUserSchema = z.object({
  id: z.number(),
  kakao_account: z.object({
    email: z.string().email(),
  }),
});
type KakaoUser = z.infer<typeof KakaoUserSchema>;

// 사용자 정보 가져오기
async function getKakaoUser(): Promise<KakaoUser | null> {
  const code = new URL(window.location.href).searchParams.get('code');
  if (!code) return null;

  try {
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
        redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        client_secret: import.meta.env.VITE_KAKAO_SECRET_KEY,
        code,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    localStorage.setItem('kakaoAccessToken', access_token);
    localStorage.setItem('kakaoRefreshToken', refresh_token);
    localStorage.setItem('kakaoTokenExpiry', (Date.now() + expires_in * 1000).toString());

    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return KakaoUserSchema.parse(userRes.data);
  } catch (err) {
    console.error('카카오 유저 정보 요청 실패:', err);
    return null;
  }
}

// 유저 정보 추출
const extractKakaoUserInfo = (data: KakaoUser) => ({
  email: data.kakao_account.email,
  sub: data.id.toString(),
});

export function KakaoRedirectPage() {
  const { isLoading } = useOauthRedirectHandler({
    getUser: getKakaoUser,
    extractUserInfo: extractKakaoUserInfo,
    category: 'KAKAO',
  });

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
