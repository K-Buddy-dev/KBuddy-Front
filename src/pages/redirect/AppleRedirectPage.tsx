import { Spinner } from '@/components/spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AppleRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const idToken = urlParams.get('id_token');

        console.log('Apple Authorization Code:', code);

        if (!code) {
          throw new Error('Authorization code not found');
        }

        const response = await fetch('/api/auth/apple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, idToken }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        console.log('data: ', data);
      } catch (err) {
        console.error('Apple authentication error:', err);
      }
    };

    handleAppleCallback();
  }, [navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
