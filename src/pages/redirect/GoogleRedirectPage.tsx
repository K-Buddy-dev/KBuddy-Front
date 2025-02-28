import { Spinner } from '@/components/spinner';
// import { useSocialTokensStore } from '@/store';
import { parseJwt } from '@/utils/utils';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const GoogleIdTokenSchema = z.object({
  iss: z.string().url(), // 발급 기관 (Google)
  azp: z.string(), // 인증된 앱의 클라이언트 ID
  aud: z.string(), // 수신자(Client ID)
  sub: z.string(), // 사용자 고유 ID
  email: z.string().email(), // 사용자 이메일
  email_verified: z.boolean(), // 이메일 인증 여부
  at_hash: z.string().optional(), // 액세스 토큰 해시값
  iat: z.number(), // 발급 시간 (Unix timestamp)
  exp: z.number(), // 만료 시간 (Unix timestamp)
});

export function GoogleRedirectPage() {
  // const { setKakaoToken } = useSocialTokensStore();
  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get('code');
  console.log('code: ', code);

  useEffect(() => {
    if (!code) {
      console.error('Authorization code not found');
      navigate('/');
      return;
    }

    const fetchKakaoToken = async () => {
      const makeFormData = (params: { [key: string]: string }) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          searchParams.append(key, params[key]);
        });
        return searchParams;
      };

      try {
        // 액세스 및 리프레쉬 토큰 받기
        const tokenResponse = await axios({
          method: 'POST',
          url: 'https://accounts.google.com/o/oauth2/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          data: makeFormData({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_PW,
            code: code,
          }),
        });

        const { id_token } = tokenResponse.data;
        const userInfo = parseJwt(id_token);
        const validatedUserInfo = GoogleIdTokenSchema.parse(userInfo);

        console.log('Validated Google User Info:', validatedUserInfo);

        // TODO: 회원가입 페이지로 이동 로직 추가
        // navigate('/signup');
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Google ID Token validation error:', error.errors);
        } else {
          console.error('Google login error:', error);
        }
      }
    };

    fetchKakaoToken();
  }, [code]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
