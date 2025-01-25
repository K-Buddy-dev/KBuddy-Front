import { Topbar } from '../components/topbar/Topbar.tsx';
import { AccordionItem } from '../components/accordion/AccordionItem.tsx';
import React from 'react';
import { FormInput } from '../components/form/FormInput.tsx';
import { LoginForm } from '../contents/login/LoginForm.tsx';

export function LoginPage() {
  const [selectedId, setSelectedId] = React.useState<string>('');

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[360px] h-[768px] px-4">
        <Topbar title="Log in or sign up" />
        <div className="mt-[72px] border-solid border border-primary rounded-2xl overflow-hidden">
          <AccordionItem
            id="login"
            name="auth"
            label="Log in"
            checked={selectedId === 'login'}
            onChange={setSelectedId}
            isFirst={true}
          >
            <LoginForm />
          </AccordionItem>
          <AccordionItem
            id="signup"
            name="auth"
            label="Create account"
            checked={selectedId === 'signup'}
            onChange={setSelectedId}
            isLast={true}
          >
            <form>
              <FormInput id="email" name="email" type="text" label="Email" />
            </form>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}
