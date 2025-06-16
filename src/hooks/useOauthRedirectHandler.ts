import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '@/store';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { OauthRequest } from '@/types';

type UseOauthRedirectHandlerParams<T> = {
  getUser: () => Promise<T | null>;
  extractUserInfo: (data: T) => { email: string; sub: string };
  category: 'GOOGLE' | 'APPLE' | 'KAKAO';
};

export function useOauthRedirectHandler<T>({ getUser, extractUserInfo, category }: UseOauthRedirectHandlerParams<T>) {
  const navigate = useNavigate();
  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        if (!user) throw new Error('사용자 정보 없음');

        const { email, sub } = extractUserInfo(user);
        setEmail(email);
        setoAuthUid(sub);
        setoAuthCategory(category);
        setMemberCheckData({ oAuthUid: sub, oAuthCategory: category });
      } catch (err) {
        console.error(`${category} 로그인 에러:`, err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!memberCheckData) return;
    checkMember(memberCheckData)
      .then(setIsMember)
      .catch((err) => console.error('회원 확인 실패:', err));
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

  return { isLoading };
}
