import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOauthLoginHandler, useToast } from '@/hooks';
import { useSocialStore } from '@/store';
import { Spinner } from '@/components/shared/spinner';

export function AppleRedirectPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setEmail, setoAuthUid, setoAuthCategory, setFirstName, setLastName, socialStoreReset } = useSocialStore();
  const { handleLogin } = useOauthLoginHandler();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const isNew = params.get('isNew') === 'true';
    const email = params.get('email');
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const oAuthUid = params.get('oAuthUid');

    if (!oAuthUid) {
      showToast({ message: 'Apple 로그인 정보가 부족합니다.', type: 'error' });
      navigate('/');
      return;
    }

    setoAuthCategory('APPLE');
    setoAuthUid(oAuthUid);

    if (isNew) {
      if (!email || !firstName || !lastName) {
        showToast({ message: 'Apple에서 이름 또는 이메일 정보를 제공하지 않았습니다.', type: 'error' });
        navigate('/');
        return;
      }

      setEmail(email);
      setFirstName(firstName);
      setLastName(lastName);

      navigate('/oauth/signup/form');
    } else {
      if (!accessToken) {
        showToast({ message: '로그인에 실패했습니다. 다시 시도해주세요.', type: 'error' });
        navigate('/');
        return;
      }

      handleLogin({ oAuthUid, oAuthCategory: 'APPLE' });
      socialStoreReset();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner />
    </div>
  );
}
