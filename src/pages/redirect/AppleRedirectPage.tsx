import { Spinner } from '@/components/shared/spinner';
import { useOauthRedirectHandler } from '@/hooks';
import { parseJwt } from '@/utils/utils';
import { z } from 'zod';

// Apple ID 토큰 스키마
const AppleIdTokenSchema = z.object({
  iss: z.literal('https://appleid.apple.com'),
  auth_time: z.number(),
  aud: z.string(),
  sub: z.string(),
  email: z.string().email().optional(),
  email_verified: z.boolean(),
  iat: z.number(),
  exp: z.number(),
  nonce_supported: z.boolean(),
  c_hash: z.string(),
});

export function AppleRedirectPage() {
  const fetchAppleUserData = async (): Promise<{ email?: string; oAuthUid: string } | null> => {
    const idToken = new URL(window.location.href).searchParams.get('id_token');
    if (!idToken) {
      console.error('ID 토큰 없음');
      return null;
    }
    try {
      const parsedData = parseJwt(idToken);
      const validatedData = AppleIdTokenSchema.parse(parsedData);
      return { oAuthUid: validatedData.sub, email: validatedData.email };
    } catch (error) {
      console.error('Apple 토큰 파싱 또는 검증 에러:', error);
      return null;
    }
  };

  const { isLoading } = useOauthRedirectHandler({
    provider: 'APPLE',
    validateSchema: AppleIdTokenSchema,
    fetchUserData: fetchAppleUserData,
  });

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
