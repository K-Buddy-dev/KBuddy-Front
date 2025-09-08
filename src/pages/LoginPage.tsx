import { Accordion, AccordionItem, Toast, Topbar } from '@/components/shared';
import { EmailVerifyForm, LoginForm, SocialLoginForm } from '@/components';
import { useToast } from '@/hooks';
import { useEffect } from 'react';

export function LoginPage() {
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const toastData = sessionStorage.getItem('toastMessage');
    if (toastData) {
      const parsedToast = JSON.parse(toastData);
      showToast({
        message: parsedToast.message,
        type: parsedToast.type,
        duration: parsedToast.duration,
      });
      // 토스트 표시 후 데이터 삭제
      sessionStorage.removeItem('toastMessage');
    }
  }, [showToast]);
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />}
      <Topbar title="Log in or sign up" type="cancel" />
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
