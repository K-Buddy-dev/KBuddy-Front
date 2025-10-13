import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOauthLoginHandler, useToast } from '@/hooks';
import { Spinner } from '@/components/shared/spinner';

export function AppleRedirectPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { handleLogin } = useOauthLoginHandler();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      showToast({ message: 'Apple 로그인 코드가 없습니다.', type: 'error' });
      navigate('/');
      return;
    }

    const exchangeAppleCode = async () => {
      try {
        // 백엔드로 code 전달
        const res = await fetch('https://api.k-buddy.kr/kbuddy/v1/auth/apple/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Apple 로그인 실패');
        }

        const { accessToken, isNew, email, firstName, lastName, oAuthUid } = data;

        if (isNew) {
          navigate('/oauth/signup/form', {
            state: { email, firstName, lastName, oAuthUid, oAuthCategory: 'APPLE' },
          });
        } else {
          if (!accessToken) {
            showToast({ message: '로그인에 실패했습니다. 다시 시도해주세요.', type: 'error' });
            navigate('/');
            return;
          }
          await handleLogin({ oAuthUid, oAuthCategory: 'APPLE' });
        }
      } catch (err) {
        console.error(err);
        showToast({ message: '로그인 중 오류가 발생했습니다.', type: 'error' });
        navigate('/');
      }
    };

    exchangeAppleCode();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner />
    </div>
  );
}
