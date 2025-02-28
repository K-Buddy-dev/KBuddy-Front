import { AppleLogo, GoogleLogo, KakaoLogo } from '@/components';
import { SocialButton } from './Social/SocialButton';
import { Link } from 'react-router-dom';

export function SocialLoginForm() {
  const VITE_KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;
  const VITE_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=${import.meta.env.VITE_GOOGLE_SCOPE}`;
  const VITE_APPLE_AUTH_URL = `https://appleid.apple.com/auth/authorize?client_id=${import.meta.env.VITE_APPLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_APPLE_REDIRECT_URI}&response_type=code%20id_token&scope=name%20email&response_mode=query`;
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Link to={VITE_KAKAO_AUTH_URL} className="w-full">
        <SocialButton logo={<KakaoLogo />} title="Continue with Kakao" type="kakao" />
      </Link>
      <Link to={VITE_GOOGLE_AUTH_URL} className="w-full">
        <SocialButton logo={<GoogleLogo />} title="Continue with Google" type="google" />
      </Link>
      <Link to={VITE_APPLE_AUTH_URL} className="w-full">
        <SocialButton logo={<AppleLogo />} title="Continue with Apple" type="apple" />
      </Link>
    </div>
  );
}
