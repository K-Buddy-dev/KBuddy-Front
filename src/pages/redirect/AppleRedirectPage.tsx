import { Spinner } from '@/components/shared/spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AppleRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const code = hashParams.get('code');
        const idToken = hashParams.get('id_token');

        console.log('Hash params - code:', code);
        console.log('Hash params - id_token:', idToken);

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
