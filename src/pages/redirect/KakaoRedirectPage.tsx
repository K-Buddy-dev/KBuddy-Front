import { Spinner } from '@/components/spinner';
import { useSocialTokensStore } from '@/store';
import { useEffect } from 'react';

export function KakaoRedirectPage() {
  const { setKakaoToken } = useSocialTokensStore();
  const code = new URL(window.location.href).searchParams.get('code');
  console.log('code: ', code);

  useEffect(() => {
    setKakaoToken(code);
  }, [code]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
