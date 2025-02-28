import { Spinner } from '@/components/spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AppleRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // form에서 전달된 데이터 처리
    const handleFormData = () => {
      // form_post 방식으로 받은 데이터 획득 시도
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const idToken = urlParams.get('id_token');

      console.log('Apple Authorization Code:', code);
      console.log('Apple ID Token:', idToken);

      if (!idToken) {
        console.error('ID Token not found');
        navigate('/');
        return;
      }

      const userInfo = decodeURI(idToken);
      console.log('Decoded Apple User Info:', userInfo);
    };

    handleFormData();
  }, [navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
