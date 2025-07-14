import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { parseJwt } from '@/utils/utils';
import { useMemberCheckHandler, useOauthLoginHandler, useToast } from '@/hooks';
import { useSocialStore } from '@/store';
import { OauthRequest } from '@/types';
import { Spinner } from '@/components/shared/spinner';

const AppleIdTokenSchema = z.object({
  iss: z.literal('https://appleid.apple.com'),
  auth_time: z.number(),
  aud: z.string(),
  sub: z.string(),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  iat: z.number(),
  exp: z.number(),
  nonce_supported: z.boolean(),
  c_hash: z.string(),
});

export function AppleRedirectPage() {
  const navigate = useNavigate();
  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset, setFirstName, setLastName } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();
  const { showToast } = useToast();

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idToken = searchParams.get('id_token');
    const userString = searchParams.get('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!idToken) {
      showToast({ message: 'Apple login failed: id_token missing', type: 'error', duration: 3000 });
      navigate('/');
      return;
    }

    try {
      const validatedUserInfo = AppleIdTokenSchema.parse(parseJwt(idToken));

      if (!user?.name?.firstName || !user?.name?.lastName) {
        showToast({
          message: 'Name sharing is required to sign up with Apple.',
          type: 'error',
          duration: 3000,
        });
        navigate('/');
        return;
      }

      setFirstName(user.name.firstName);
      setLastName(user.name.lastName);
      setEmail(validatedUserInfo.email || '');
      setoAuthUid(validatedUserInfo.sub);
      setoAuthCategory('APPLE');

      setMemberCheckData({ oAuthUid: validatedUserInfo.sub, oAuthCategory: 'APPLE' });
    } catch (error) {
      console.error('Apple login error:', error);
      showToast({ message: 'Apple login validation failed.', type: 'error', duration: 3000 });
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!memberCheckData) return;
    checkMember(memberCheckData)
      .then(setIsMember)
      .catch((error) => {
        console.error('Member check failed:', error);
        showToast({ message: 'Member check failed.', type: 'error', duration: 3000 });
        navigate('/');
      });
  }, [memberCheckData]);

  useEffect(() => {
    if (isMember === null) return;

    if (isMember) {
      handleLogin(memberCheckData!);
      socialStoreReset();
      navigate('/home', { replace: true });
    } else {
      navigate('/oauth/signup/form', { replace: true });
    }
  }, [isMember]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return null;
}
