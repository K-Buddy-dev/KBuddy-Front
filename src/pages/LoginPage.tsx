import { Accordion, AccordionItem, Topbar } from '@/components/shared';
import { EmailVerifyForm, LoginForm, SocialLoginForm } from '@/components';

export function LoginPage() {
  return (
    <>
      <Topbar title="Log in or sign up" type="cancel" />
      <div className="mt-[72px]">
        <Accordion defaultSelectedId="login">
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
