import { useOauthRedirectHandler } from '@/hooks';
import { Spinner } from '@/components/shared/spinner';
import { parseJwt } from '@/utils/utils';
import { z } from 'zod';

const AppleSchema = z.object({
  sub: z.string(),
  email: z.string().optional(),
});
type AppleUser = z.infer<typeof AppleSchema>;

const getAppleUser = async (): Promise<AppleUser | null> => {
  const idToken = localStorage.getItem('appleIdToken');
  if (!idToken) return null;
  return AppleSchema.parse(parseJwt(idToken));
};

const extractAppleUserInfo = (data: AppleUser) => ({
  email: data.email ?? '',
  sub: data.sub,
});

export function AppleRedirectPage() {
  const { isLoading } = useOauthRedirectHandler({
    getUser: getAppleUser,
    extractUserInfo: extractAppleUserInfo,
    category: 'APPLE',
  });

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  ) : null;
}
