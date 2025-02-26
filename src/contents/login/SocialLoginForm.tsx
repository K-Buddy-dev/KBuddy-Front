import { AppleLogo, GoogleLogo, KakaoLogo } from '@/components';
import { SocialButton } from './Social/SocialButton';
import { Link } from 'react-router-dom';

export function SocialLoginForm() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Link to={import.meta.env.VITE_KAKAO_AUTH_URL} className="w-full">
        <SocialButton logo={<KakaoLogo />} title="Continue with Kakao" type="kakao" />
      </Link>
      <Link to={import.meta.env.VITE_GOOGLE_AUTH_URL} className="w-full">
        <SocialButton logo={<GoogleLogo />} title="Continue with Google" type="google" />
      </Link>
      <SocialButton logo={<AppleLogo />} title="Continue with Apple" type="apple" />
    </div>
  );
}
