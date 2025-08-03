import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { parseJwt } from '@/utils/utils';
import { useMemberCheckHandler, useOauthLoginHandler, useToast } from '@/hooks';
import { useSocialStore } from '@/store';
import { Spinner } from '@/components/shared/spinner';

const AppleIdTokenSchema = z.object({
  iss: z.literal('https://appleid.apple.com'),
  aud: z.string(),
  sub: z.string(),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  iat: z.number(),
  exp: z.number(),
  nonce_supported: z.boolean().optional(),
});

export function AppleRedirectPage() {
  const navigate = useNavigate();
  const { setEmail, setoAuthUid, setoAuthCategory, setFirstName, setLastName, socialStoreReset } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();
  const { showToast } = useToast();

  const [memberCheckData, setMemberCheckData] = useState<{
    oAuthUid: string;
    oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
  } | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    // 애플에서 POST로 보낸 form 데이터 읽기 (location.search가 아닌 post 방식 시 window.history.state 등에 저장될 수 있음)
    const params = new URLSearchParams(window.location.search);

    const idToken = params.get('id_token') || window.history.state?.id_token;
    const userStr = params.get('user') || window.history.state?.user;

    if (!idToken) {
      showToast({ message: '애플 로그인에 실패했습니다. 다시 시도해주세요.', type: 'error' });
      navigate('/');
      return;
    }

    try {
      const decoded = parseJwt(idToken);
      const validated = AppleIdTokenSchema.parse(decoded);

      let firstName = '';
      let lastName = '';

      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.name?.firstName) firstName = user.name.firstName;
        if (user?.name?.lastName) lastName = user.name.lastName;
      }

      if (!firstName || !lastName) {
        showToast({ message: '이름 제공이 필요합니다. 애플 로그인 설정을 확인해주세요.', type: 'error' });
        navigate('/');
        return;
      }

      setFirstName(firstName);
      setLastName(lastName);

      setEmail(validated.email || '');
      setoAuthUid(validated.sub);
      setoAuthCategory('APPLE');

      setMemberCheckData({ oAuthUid: validated.sub, oAuthCategory: 'APPLE' as const });
    } catch (error) {
      console.error('애플 토큰 파싱 오류:', error);
      showToast({ message: '애플 로그인 정보가 유효하지 않습니다.', type: 'error' });
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!memberCheckData) return;
    checkMember(memberCheckData)
      .then(setIsMember)
      .catch(() => {
        showToast({ message: '회원 확인 중 오류가 발생했습니다.', type: 'error' });
        navigate('/');
      });
  }, [memberCheckData]);

  useEffect(() => {
    if (isMember === null) return;
    if (isMember) {
      if (memberCheckData) {
        handleLogin(memberCheckData);
        socialStoreReset();
      }
    } else {
      navigate('/oauth/signup/form');
    }
  }, [isMember, memberCheckData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  }

  return null;
}
