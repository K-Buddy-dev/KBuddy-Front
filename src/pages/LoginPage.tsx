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
      </div>
    </>
  );
}
