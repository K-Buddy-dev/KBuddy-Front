import { Spinner } from '@/components/shared/spinner';
// import { useMemberCheckHandler, useOauthLoginHandler } from '@/hooks';
// import { useSocialStore } from '@/store';
// import { OauthRequest } from '@/types';
import { parseJwt } from '@/utils/utils'; // JWT 디코딩 유틸리티
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// Apple ID Token 스키마 정의
// const AppleIdTokenSchema = z.object({
//   iss: z.literal('https://appleid.apple.com'), // Apple의 issuer
//   aud: z.string(), // 클라이언트 ID와 일치해야 함
//   sub: z.string(), // 사용자 고유 ID
//   email: z.string().email().optional(), // 이메일 (최초 로그인 시에만 제공됨)
//   email_verified: z.enum(['true', 'false']).optional(),
//   iat: z.number(), // 발급 시간
//   exp: z.number(), // 만료 시간
// });

// type AppleUserResponse = z.infer<typeof AppleIdTokenSchema>;

export function AppleRedirectPage() {
  // const navigate = useNavigate();

  // const { setEmail, setoAuthUid, setoAuthCategory } = useSocialStore();
  // const { checkMember, isLoading } = useMemberCheckHandler();
  // const { handleLogin } = useOauthLoginHandler();

  // const [memberCheckData, setMemberCheckData] = useState<OauthRequest | null>(null);
  // const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        let code = null;
        let idToken = null;

        // 1. form_post 방식으로 전달된 데이터 확인
        if (document.forms.length > 0) {
          console.log('Form detected, extracting data from form');
          const formData = new FormData(document.forms[0]);
          code = formData.get('code') as string;
          idToken = formData.get('id_token') as string;
          console.log('Form data - code:', code);
          console.log('Form data - id_token:', idToken);
        }

        // 2. URL 쿼리 파라미터 확인 (백업)
        if (!idToken) {
          console.log('Checking URL query parameters');
          const urlParams = new URLSearchParams(window.location.search);
          code = urlParams.get('code');
          idToken = urlParams.get('id_token');
          console.log('URL params - code:', code);
          console.log('URL params - id_token:', idToken);
        }

        // 3. URL 해시 파라미터 확인 (백업)
        if (!idToken && window.location.hash) {
          console.log('Checking URL hash parameters');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          code = hashParams.get('code');
          idToken = hashParams.get('id_token');
          console.log('Hash params - code:', code);
          console.log('Hash params - id_token:', idToken);
        }

        if (!idToken) {
          throw new Error('ID token not found. Check browser console for details.');
        }

        // id_token 디코딩 및 유효성 검사
        const userInfo = parseJwt(idToken);
        console.log('userInfo: ', userInfo);
        // const validatedUserInfo = AppleIdTokenSchema.parse(userInfo);

        // // 상태에 사용자 정보 저장
        // setEmail(validatedUserInfo.email || ''); // Apple은 최초 로그인 시에만 email 제공
        // setoAuthUid(validatedUserInfo.sub); // Apple 사용자 고유 ID
        // setoAuthCategory('APPLE');

        // 회원 확인용 데이터 설정
        // setMemberCheckData({
        //   oAuthUid: validatedUserInfo.sub,
        //   oAuthCategory: 'APPLE',
        // });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Apple ID Token validation error:', error.errors);
        } else {
          console.error('Apple authentication error:', error);
        }
      }
    };

    if (document.readyState === 'loading') {
      console.log('Waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', handleAppleCallback);
    } else {
      console.log('DOM already loaded, running callback immediately');
      handleAppleCallback();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handleAppleCallback);
    };
  }, []);

  // 회원 여부 확인
  // useEffect(() => {
  //   if (!memberCheckData) return;

  //   const fetchMemberStatus = async () => {
  //     const status = await checkMember(memberCheckData);
  //     setIsMember(status);
  //   };

  //   fetchMemberStatus();
  // }, [memberCheckData]);

  // 회원 여부에 따라 리다이렉트
  // useEffect(() => {
  //   if (isMember !== null) {
  //     if (isMember) {
  //       console.log('기존 회원, 로그인 실행');
  //       handleLogin(memberCheckData!);
  //     } else {
  //       console.log('회원가입 페이지로 이동');
  //       navigate('/oauth/signup/form');
  //     }
  //   }
  // }, [isMember]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return null;
}
