import axios from 'axios';
import { parseJwt } from '@/utils/utils';
import { z } from 'zod';
import { useOauthRedirectHandler } from '@/hooks';
import { Spinner } from '@/components/shared/spinner';

// Google ID 토큰 스키마
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
  const fetchGoogleUserData = async (): Promise<{ email?: string; oAuthUid: string } | null> => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      console.error('인증 코드 없음');
      return null;
    }
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_PW,
          redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } }
      );
      const { id_token } = tokenResponse?.data ?? {};
      if (!id_token) throw new Error('ID 토큰 없음');
      const parsedData = parseJwt(id_token);
      const validatedData = GoogleIdTokenSchema.parse(parsedData);
      return { oAuthUid: validatedData.sub, email: validatedData.email };
    } catch (error) {
      console.error('Google 토큰 가져오기 실패:', error);
      return null;
    }
  };

  const { isLoading } = useOauthRedirectHandler({
    provider: 'GOOGLE',
    validateSchema: GoogleIdTokenSchema,
    fetchUserData: fetchGoogleUserData,
  });

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
