import { Spinner } from '@/components/spinner';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks/useOauth';
import { OauthRequest } from '@/types';
// import { useSocialTokensStore } from '@/store';
import { parseJwt } from '@/utils/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const GoogleIdTokenSchema = z.object({
  iss: z.enum(['https://accounts.google.com', 'accounts.google.com']),
  azp: z.string(),
  aud: z.string(),
  sub: z.string(),
  email: z.string().email(),
  email_verified: z.boolean(),
  at_hash: z.string().optional(),
  iat: z.number(),
  exp: z.number(),
});

export function GoogleRedirectPage() {
  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get('code');

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);

  const { isMember, isLoading } = useMemberCheckHandler(memberCheckData ?? { oAuthUid: '', oAuthCategory: 'GOOGLE' });
  const { handleLogin } = useOauthLoginHandler();
  useEffect(() => {
    if (!code) {
      console.error('Authorization code not found');
      return;
    }

    const fetchGoogleToken = async () => {
      try {
        const tokenResponse = await axios.post(
          'https://oauth2.googleapis.com/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_PW,
            redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
            code: code,
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
          }
        );

        const { id_token } = tokenResponse.data;
        console.log('tokenResponse: ', tokenResponse);
        const userInfo = parseJwt(id_token);
        const validatedUserInfo = GoogleIdTokenSchema.parse(userInfo);
        setMemberCheckData({
          oAuthUid: validatedUserInfo.sub,
          oAuthCategory: 'GOOGLE',
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Google ID Token validation error:', error.errors);
        } else {
          console.error('Google login error:', error);
        }
      }
    };

    fetchGoogleToken();
  }, []);

  useEffect(() => {
    if (isMember) {
      console.log('기존 회원, 로그인 실행');
      handleLogin(memberCheckData!);
    } else {
      console.log('회원가입 페이지로 이동');
      navigate('/signup/form');
    }
  }, [isMember, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return null;
}
