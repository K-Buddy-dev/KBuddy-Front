import { AppleLogo, GoogleLogo, KakaoLogo } from '@/components/shared';
import { SocialButton } from './Social/SocialButton';
import { generateRandomString } from '@/utils/utils';

export function SocialLoginForm() {
  const VITE_KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)}&response_type=code`;
  const VITE_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI)}&response_type=code&scope=${import.meta.env.VITE_GOOGLE_SCOPE}`;
  // const VITE_APPLE_AUTH_URL = `https://appleid.apple.com/auth/authorize?client_id=${import.meta.env.VITE_APPLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_APPLE_REDIRECT_URI)}&response_type=code%20id_token&scope=name%20email&response_mode=fragment`;

  const state = generateRandomString(32);

  const handleSocialLogin = (url: string) => {
    window.location.href = url;
  };

  const handleAppleLogin = async () => {
    try {
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_APPLE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_APPLE_REDIRECT_URI,
        response_type: 'code id_token',
        scope: 'name email',
        response_mode: 'form_post',
        state: state,
      });

      window.location.href = `https://appleid.apple.com/auth/authorize?${params}`;
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-full" onClick={() => handleSocialLogin(VITE_KAKAO_AUTH_URL)}>
        <SocialButton logo={<KakaoLogo />} title="Continue with Kakao" type="kakao" />
      </div>
      <div className="w-full" onClick={() => handleSocialLogin(VITE_GOOGLE_AUTH_URL)}>
        <SocialButton logo={<GoogleLogo />} title="Continue with Google" type="google" />
      </div>
      <div className="w-full" onClick={() => handleAppleLogin()}>
        <SocialButton logo={<AppleLogo />} title="Continue with Apple" type="apple" />
      </div>
    </div>
  );
}
