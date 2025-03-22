import { Spinner } from '@/components/shared/spinner';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { useSocialStore } from '@/store';
import { OauthRequest } from '@/types';
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
type GoogleUserResponse = z.infer<typeof GoogleIdTokenSchema>;

export function GoogleRedirectPage() {
  const navigate = useNavigate();

  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();

  const code = new URL(window.location.href).searchParams.get('code');

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  const setOauthSignupData = (data: GoogleUserResponse) => {
    setEmail(data.email);
    setoAuthUid(data.sub);
    setoAuthCategory('GOOGLE');
  };

  const fetchGoogleToken = async () => {
    if (!code) {
      console.error('Authorization code not found');
      return;
    }

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

      const { id_token } = tokenResponse?.data ?? {};

      if (!id_token) {
        throw new Error('ID token not found. Check browser console for details.');
      }

      const validatedUserInfo = GoogleIdTokenSchema.parse(parseJwt(id_token));
      setOauthSignupData(validatedUserInfo);
      setMemberCheckData({ oAuthUid: validatedUserInfo.sub, oAuthCategory: 'GOOGLE' });
    } catch (error) {
      console.error('Google login error:', error instanceof z.ZodError ? error.errors : error);
    }
  };

  useEffect(() => {
    fetchGoogleToken();
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
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
