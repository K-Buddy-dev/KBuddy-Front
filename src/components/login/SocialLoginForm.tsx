import { useEffect } from 'react';
import { AppleLogo, GoogleLogo, KakaoLogo } from '../shared';
import { SocialButton } from './Social/SocialButton';
import { generateRandomString } from '@/utils/utils';

export function SocialLoginForm() {
  const isNative = typeof window !== 'undefined' && !!window.ReactNativeWebView;
  const VITE_KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)}&response_type=code`;
  const VITE_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI)}&response_type=code&scope=${import.meta.env.VITE_GOOGLE_SCOPE}`;

  const state = generateRandomString(32);

  const handleSocialLogin = (url: string, type: 'Kakao' | 'Google') => {
    if (isNative && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type, action: 'getSocialLogin' }));
    } else {
      window.location.href = url;
    }
  };

  const handleAppleLogin = async () => {
    try {
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_APPLE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_APPLE_REDIRECT_URI,
        response_type: 'code id_token',
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
        console.log('message: ', message);
        if (typeof message === 'object' && message.oAuthUid && message.oAuthCategory) {
          console.log(`oAuthUid: ${message.oAuthUid}, oAuthCategory: ${message.oAuthCategory}`);
        }
      } catch (error) {
        console.error('Error parsing message from RN:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-full" onClick={() => handleSocialLogin(VITE_KAKAO_AUTH_URL, 'Kakao')}>
        <SocialButton logo={<KakaoLogo />} title="Continue with Kakao" type="kakao" />
      </div>
      <div className="w-full" onClick={() => handleSocialLogin(VITE_GOOGLE_AUTH_URL, 'Google')}>
        <SocialButton logo={<GoogleLogo />} title="Continue with Google" type="google" />
      </div>
      <div className="w-full" onClick={() => handleAppleLogin()}>
        <SocialButton logo={<AppleLogo />} title="Continue with Apple" type="apple" />
      </div>
    </div>
  );
}
