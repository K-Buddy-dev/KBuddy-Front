import { Spinner } from '@/components/spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AppleRedirectPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const idToken = urlParams.get('id_token');

  console.log('Apple Authorization Code:', code);
  console.log('Apple ID Token:', idToken);

  useEffect(() => {
    if (!idToken) {
      console.error('ID Token not found');
      navigate('/');
      return;
    }

    const userInfo = decodeURI(idToken);
    console.log('Decoded Apple User Info:', userInfo);
  }, [idToken, navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
