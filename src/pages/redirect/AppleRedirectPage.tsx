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

  const { setEmail, setoAuthUid, setoAuthCategory } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    const idToken = new URL(window.location.href).searchParams.get('id_token');

    if (!idToken) {
      console.error('ID token not found');
      return;
    }

    const setOauthSignupData = (data: AppleUserResponse) => {
      setEmail(data.email || '');
      setoAuthUid(data.sub);
      setoAuthCategory('APPLE');
    };

    const fetchAppleUserInfo = async () => {
      try {
        const userInfo = parseJwt(idToken);
        const validatedUserInfo = AppleIdTokenSchema.parse(userInfo);

        if (validatedUserInfo) {
          setOauthSignupData(validatedUserInfo);
        }

        setMemberCheckData({
          oAuthUid: validatedUserInfo.sub,
          oAuthCategory: 'APPLE',
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Apple ID Token validation error:', error.errors);
        } else {
          console.error('Apple authentication error:', error);
        }
      }
    };

    fetchAppleUserInfo();
  }, []);

  useEffect(() => {
    if (!memberCheckData) return;

    const fetchMemberStatus = async () => {
      const status = await checkMember(memberCheckData);
      setIsMember(status);
    };

    fetchMemberStatus();
  }, [memberCheckData]);

  useEffect(() => {
    if (isMember !== null) {
      if (isMember) {
        console.log('기존 회원, 로그인 실행');
        handleLogin(memberCheckData!);
      } else {
        console.log('회원가입 페이지로 이동');
        navigate('/oauth/signup/form');
      }
    }
  }, [isMember]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return null;
}
