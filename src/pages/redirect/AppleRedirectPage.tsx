import { Spinner } from '@/components/shared/spinner';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { useSocialStore } from '@/store';
import { OauthRequest } from '@/types';
import { parseJwt } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

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
type AppleUserResponse = z.infer<typeof AppleIdTokenSchema>;

export function AppleRedirectPage() {
  const navigate = useNavigate();

  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  const setOauthSignupData = (data: AppleUserResponse) => {
    setEmail(data.email || '');
    setoAuthUid(data.sub);
    setoAuthCategory('APPLE');
  };

  const getAppleUserInfo = async () => {
    const idToken = new URL(window.location.href).searchParams.get('id_token');

    if (!idToken) {
      console.error('ID token not found');
      return;
    }
    try {
      const validatedUserInfo = AppleIdTokenSchema.parse(parseJwt(idToken));
      setOauthSignupData(validatedUserInfo);
      setMemberCheckData({ oAuthUid: validatedUserInfo.sub, oAuthCategory: 'APPLE' });
    } catch (error) {
      console.error('Apple login error:', error instanceof z.ZodError ? error.errors : error);
    }
  };

  useEffect(() => {
    getAppleUserInfo();
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
