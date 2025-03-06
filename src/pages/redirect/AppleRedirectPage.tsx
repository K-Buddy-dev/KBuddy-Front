import { Spinner } from '@/components/shared/spinner';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

export function AppleRedirectPage() {
  // const navigate = useNavigate();

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        let code = null;
        let idToken = null;

        // 1. form_post 방식으로 전송된 데이터 확인 (form이 있는 경우)
        if (document.forms.length > 0) {
          console.log('Form detected, extracting data from form');
          const formData = new FormData(document.forms[0]);
          code = formData.get('code');
          idToken = formData.get('id_token');
          console.log('Form data - code:', code);
          console.log('Form data - id_token:', idToken);
        }

        // 2. URL 쿼리 파라미터 확인 (백업 방법)
        if (!code) {
          console.log('Checking URL query parameters');
          const urlParams = new URLSearchParams(window.location.search);
          code = urlParams.get('code');
          idToken = urlParams.get('id_token');
          console.log('URL params - code:', code);
          console.log('URL params - id_token:', idToken);
        }

        // 3. URL 해시 파라미터 확인 (백업 방법)
        if (!code && window.location.hash) {
          console.log('Checking URL hash parameters');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          code = hashParams.get('code');
          idToken = hashParams.get('id_token');
          console.log('Hash params - code:', code);
          console.log('Hash params - id_token:', idToken);
        }

        if (!code) {
          throw new Error('Authorization code not found. Check browser console for details.');
        }
      } catch (err) {
        console.error('Apple authentication error:', err);
      }
    };

    // DOMContentLoaded 이벤트를 기다려 form이 완전히 로드된 후 처리
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleAppleCallback);
    } else {
      handleAppleCallback();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handleAppleCallback);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
