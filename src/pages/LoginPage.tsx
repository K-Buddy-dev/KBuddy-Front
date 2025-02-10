import { Accordion, AccordionItem, TextField, Topbar } from '@/components';
import { LoginForm } from '@/contents/login/LoginForm';
import { useState } from 'react';

export function LoginPage() {
  const [email, setEmail] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Topbar title="Log in or sign up" />
      <div className="mt-[72px]">
        <Accordion defaultSelectedId="login">
          <AccordionItem id="login" name="auth" label="Log in">
            <LoginForm />
          </AccordionItem>
          <AccordionItem id="signup" name="auth" label="Create account">
            <form>
              <TextField id="email" name="email" type="text" label="Email" value={email} onChange={handleChangeEmail} />
            </form>
          </AccordionItem>
        </Accordion>
        <div className="flex items-center gap-1 w-full my-[40px]">
          <div className="h-[1px] flex-1 bg-border-weak1"></div>
          <span className="text-text-default text-body-200-light">or</span>
          <div className="h-[1px] flex-1 bg-border-weak1"></div>
        </div>
      </div>
    </>
  );
}
