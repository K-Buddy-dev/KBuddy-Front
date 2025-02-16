import { Spinner } from '@/components/spinner';
import { useSocialTokensStore } from '@/store';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function KakaoRedirectPage() {
  const { setKakaoToken } = useSocialTokensStore();
  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (!code) {
      console.error('Authorization code not found');
      navigate('/');
      return;
    }

    const fetchKakaoToken = async () => {
      const makeFormData = (params: { [key: string]: string }) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          searchParams.append(key, params[key]);
        });
        return searchParams;
      };

      try {
        // 1. 액세스 토큰 받기
        const tokenResponse = await axios({
          method: 'POST',
          url: 'https://kauth.kakao.com/oauth/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          data: makeFormData({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
            redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
            client_secret: import.meta.env.VITE_KAKAO_SECRET_KEY,
            code: code,
          }),
        });
        console.log('tokenResponse', tokenResponse);
        const { access_token, refresh_token } = tokenResponse.data;
        console.log('refresh_token: ', refresh_token);
        setKakaoToken(access_token);

        // 2. 사용자 정보 가져오기
        const userResponse = await axios({
          method: 'GET',
          url: 'https://kapi.kakao.com/v2/user/me',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userData = userResponse.data;

        // 3. 필요한 사용자 정보 저장 또는 처리
        console.log('Kakao User Data:', userData);

        // 4. 메인 페이지나 원하는 페이지로 리다이렉트
        navigate('/');
      } catch (error) {
        console.error('Kakao login error:', error);
        // navigate('/login'); // 에러 발생 시 로그인 페이지로 리다이렉트
      }
    };

    fetchKakaoToken();
  }, [code, navigate, setKakaoToken]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
