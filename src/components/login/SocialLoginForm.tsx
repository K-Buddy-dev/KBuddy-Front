import { useEffect, useState } from 'react';
import { AppleLogo, GoogleLogo, KakaoLogo } from '../shared';
import { SocialButton } from './Social/SocialButton';
import { generateRandomString } from '@/utils/utils';
import { OauthRequest, ReactNativeRequest } from '@/types';
import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
import { useSocialStore } from '@/store';
import { useNavigate } from 'react-router-dom';

export function SocialLoginForm() {
  const isNative = typeof window !== 'undefined' && !!window.ReactNativeWebView;
  const VITE_KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)}&response_type=code`;
  const VITE_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI)}&response_type=code&scope=${import.meta.env.VITE_GOOGLE_SCOPE}`;

  const state = generateRandomString(32);
  const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const { setEmail, setoAuthUid, setoAuthCategory, socialStoreReset } = useSocialStore();
  const { checkMember } = useMemberCheckHandler();

  const { handleLogin } = useOauthLoginHandler();

  const handleSocialLogin = (url: string, type: 'Kakao' | 'Google') => {
    if (isNative && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type, action: 'getSocialLogin' }));
    } else {
      window.location.href = url;
    }
  };

  const setOauthSignupData = (data: ReactNativeRequest) => {
    setEmail(data.oAuthEmail || '');
    setoAuthUid(data.oAuthUid);
    setoAuthCategory(data.oAuthCategory);
  };

  const handleAppleLogin = async () => {
    try {
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_APPLE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_APPLE_REDIRECT_URI,
        response_type: 'code id_token',
        scope: 'name email',
        state: state,
      });

      const url = `https://appleid.apple.com/auth/authorize?${params}`;
      if (isNative && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'Apple', action: 'getSocialLogin' }));
      } else {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        // console.log('message: ', message);
        if (message.oAuthEmail && message.oAuthUid && message.oAuthCategory) {
          setOauthSignupData(message);
          setMemberCheckData({ oAuthUid: message.oAuthUid, oAuthCategory: message.oAuthCategory });
        }
      } catch (error) {
        console.error('Error parsing message from RN:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
  }, []);

  useEffect(() => {
    if (!memberCheckData) return;
    // console.log('memberCheckData: ', memberCheckData);
    checkMember(memberCheckData).then(setIsMember);
    // .catch((error) => console.error('Member check failed:', error));
  }, [memberCheckData]);

  useEffect(() => {
    if (isMember === null) return;
    // console.log('isMember: ', isMember);

    if (isMember) {
      handleLogin(memberCheckData!);
      socialStoreReset();
    } else {
      navigate('/oauth/signup/form');
    }
  }, [isMember]);

  const isIOS = (() => {
    if (!isNative) return true;
    const userAgent = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  })();

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-full" onClick={() => handleSocialLogin(VITE_KAKAO_AUTH_URL, 'Kakao')}>
        <SocialButton logo={<KakaoLogo />} title="Continue with Kakao" type="kakao" />
      </div>
      <div className="w-full" onClick={() => handleSocialLogin(VITE_GOOGLE_AUTH_URL, 'Google')}>
        <SocialButton logo={<GoogleLogo />} title="Continue with Google" type="google" />
      </div>
      {isIOS && (
        <div className="w-full" onClick={() => handleAppleLogin()}>
          <SocialButton logo={<AppleLogo />} title="Continue with Apple" type="apple" />
        </div>
      )}
    </div>
  );
}
