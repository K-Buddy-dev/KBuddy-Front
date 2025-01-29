import { Topbar } from '../components/topbar/Topbar.tsx';
import { AccordionItem } from '../components/accordion/AccordionItem.tsx';
import { FormInput } from '../components/form/FormInput.tsx';
import { LoginForm } from '../contents/login/LoginForm.tsx';
import { Accordion } from '../components/accordion/Accordion.tsx';

export function LoginPage() {
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
              <FormInput id="email" name="email" type="text" label="Email" />
            </form>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
