import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { useSocialStore } from '@/store';
import { OauthRequest } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// OAuth 제공자 타입 정의
type OAuthProvider = 'APPLE' | 'GOOGLE' | 'KAKAO';

// OAuth 사용자 데이터 인터페이스
interface OAuthUserData {
  email?: string;
  oAuthUid: string;
}

// OAuth 설정 인터페이스
interface OAuthConfig<T> {
  provider: OAuthProvider;
  validateSchema: z.ZodSchema<T>;
  fetchUserData: () => Promise<OAuthUserData | null>;
}

// 공통 OAuth 리다이렉트 훅
export function useOauthRedirectHandler<T>({ provider, validateSchema, fetchUserData }: OAuthConfig<T>) {
  const navigate = useNavigate();
  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset } = useSocialStore();
  const { checkMember, isLoading } = useMemberCheckHandler();
  const { handleLogin } = useOauthLoginHandler();

  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  const setOauthSignupData = ({ email, oAuthUid }: OAuthUserData) => {
    setEmail(email || '');
    setoAuthUid(oAuthUid);
    setoAuthCategory(provider);
  };

  useEffect(() => {
    async function initializeOAuth() {
      try {
        const userData = await fetchUserData();
        if (!userData) {
          console.error(`${provider} 사용자 데이터 가져오기 실패`);
          return;
        }
        // validateSchema는 fetchUserData의 원본 데이터를 검증
        validateSchema.parse(userData);
        setOauthSignupData(userData);
        setMemberCheckData({ oAuthUid: userData.oAuthUid, oAuthCategory: provider });
      } catch (error) {
        console.error(`${provider} 로그인 에러:`, error instanceof z.ZodError ? error.errors : error);
      }
    }
    initializeOAuth();
  }, [provider, validateSchema, fetchUserData]);

  useEffect(() => {
    if (!memberCheckData) return;
    checkMember(memberCheckData)
      .then(setIsMember)
      .catch((error) => console.error('멤버 체크 실패:', error));
  }, [memberCheckData, checkMember]);

  useEffect(() => {
    if (isMember === null) return;
    if (isMember) {
      handleLogin(memberCheckData!);
      socialStoreReset();
    } else {
      navigate('/oauth/signup/form');
    }
  }, [isMember, handleLogin, memberCheckData, navigate, socialStoreReset]);

  return { isLoading };
}
