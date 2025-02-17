import { Accordion, AccordionItem, Topbar } from '@/components';
import { LoginForm, EmailVerifyForm } from '@/contents';

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
      </div>
    </>
  );
}
