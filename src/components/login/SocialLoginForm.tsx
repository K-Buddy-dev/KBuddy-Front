import { AppleLogo, GoogleLogo, KakaoLogo } from '../shared';
import { SocialButton } from './Social/SocialButton';

declare global {
  interface Window {
    AppleID: any;
  }
}

export function SocialLoginForm() {
  const isNative = typeof window !== 'undefined' && !!window.ReactNativeWebView;
  const VITE_KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)}&response_type=code`;
  const VITE_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI)}&response_type=code&scope=${import.meta.env.VITE_GOOGLE_SCOPE}`;

  // 기존 소셜 로그인 (카카오, 구글) 처리
  const handleSocialLogin = (url: string, type: 'Kakao' | 'Google') => {
    if (isNative && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type, action: 'getSocialLogin' }));
    } else {
      window.location.href = url;
    }
  };

  // 팝업 방식 애플 로그인은 팝업 열기만, 후속처리는 콜백 라우트에서!
  const handleAppleLogin = async () => {
    try {
      window.AppleID.auth.init({
        clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI,
        usePopup: true,
      });

      await window.AppleID.auth.signIn();
      // 여기서 멤버 체크, 네비게이션 처리 X
    } catch (error) {
      console.error('Apple login popup error:', error);
    }
  };

  // UI
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
