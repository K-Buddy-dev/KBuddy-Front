import { Spinner } from '@/components/spinner';
import { useSocialTokensStore } from '@/store';
import axios from 'axios';
import { useEffect } from 'react';
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

export function GoogleRedirectPage() {
  const { setKakaoToken } = useSocialTokensStore();
  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get('code');

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
          url: 'https://kauth.kakao.com/oauth/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          data: makeFormData({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
            redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
            client_secret: import.meta.env.VITE_KAKAO_SECRET_KEY,
            code: code,
          }),
        });
        console.log('tokenResponse', tokenResponse);
        const { access_token, refresh_token } = tokenResponse.data;
        console.log('refresh_token: ', refresh_token);
        setKakaoToken(access_token);

        // 사용자 정보 가져오기
        const userResponse = await axios({
          method: 'GET',
          url: 'https://kapi.kakao.com/v2/user/me',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userData = KakaoUserResponseSchema.parse(userResponse.data);
        console.log('Validated Kakao User Data:', userData);

        // 메인 페이지 리다이렉트 -> 회원가입 페이지로 바꿀 예정
        navigate('/');
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Data validation error:', error.errors);
        } else {
          console.error('Kakao login error:', error);
        }
      }
    };

    fetchKakaoToken();
  }, [code, navigate, setKakaoToken]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
