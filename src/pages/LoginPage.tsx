import { Accordion, AccordionItem, Toast, Topbar } from '@/components/shared';
import { EmailVerifyForm, LoginForm, SocialLoginForm } from '@/components';
import { useToast } from '@/hooks';
import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

export function LoginPage() {
  const { toast, hideToast } = useToast();
  const navigate = useNavigate();

  /**
   * 로그인은 이제 거쳐 가는 화면이므로 닫을 수 있어야 한다.
   * 직전 화면으로 되돌리면 보호 경로에서 넘어온 경우 다시 로그인으로 튕겨 무한 왕복이 되므로 홈으로 보낸다.
   */
  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />}
      <Topbar title="Log in or sign up" type="cancel" onCancle={handleCancel} />
      <div className="mt-[72px]">
        <Accordion defaultSelectedId="signup">
          <AccordionItem id="login" name="auth" label="Log in">
            <LoginForm />
          </AccordionItem>
          <AccordionItem id="signup" name="auth" label="Create account">
            <EmailVerifyForm />
          </AccordionItem>
        </Accordion>
        <div className="flex items-center gap-1 w-full my-[40px]">
          <div className="h-[1px] flex-1 bg-border-weak1"></div>
          <span className="text-text-default text-body-200-light">or</span>
          <div className="h-[1px] flex-1 bg-border-weak1"></div>
        </div>
        <SocialLoginForm />
      </div>
    </>
  );
}
