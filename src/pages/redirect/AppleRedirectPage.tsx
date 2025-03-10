import { Spinner } from '@/components/shared/spinner';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { useSocialStore } from '@/store';
import { OauthRequest } from '@/types';
import { parseJwt } from '@/utils/utils'; // JWT 디코딩 유틸리티
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// Apple ID Token 스키마 정의
const AppleIdTokenSchema = z.object({
  iss: z.literal('https://appleid.apple.com'), // Apple의 issuer
  aud: z.string(), // 클라이언트 ID와 일치해야 함
  sub: z.string(), // 사용자 고유 ID
  email: z.string().email().optional(), // 이메일 (최초 로그인 시에만 제공됨)
  email_verified: z.enum(['true', 'false']).optional(),
  iat: z.number(), // 발급 시간
  exp: z.number(), // 만료 시간
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
