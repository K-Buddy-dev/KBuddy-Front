import { useOauthRedirectHandler } from '@/hooks';
import { parseJwt } from '@/utils/utils';
import { Spinner } from '@/components/shared/spinner';
import { z } from 'zod';

const GoogleSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
});
type GoogleUser = z.infer<typeof GoogleSchema>;

const getGoogleUser = async (): Promise<GoogleUser | null> => {
  const idToken = localStorage.getItem('googleIdToken');
  if (!idToken) return null;
  return GoogleSchema.parse(parseJwt(idToken));
};

const extractGoogleUserInfo = (data: GoogleUser) => ({
  email: data.email,
  sub: data.sub,
});

export function GoogleRedirectPage() {
  const { isLoading } = useOauthRedirectHandler({
    getUser: getGoogleUser,
    extractUserInfo: extractGoogleUserInfo,
    category: 'GOOGLE',
  });

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
