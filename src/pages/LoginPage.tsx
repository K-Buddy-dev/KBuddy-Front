import { Accordion, AccordionItem, Button, TextField, Topbar } from '@/components';
import { LoginForm } from '@/contents/login/LoginForm';
import { useSignupStore } from '@/store/useSignupStore';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { email, setEmail } = useSignupStore();
  const navigate = useNavigate();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/signup/verify');
  };

  return (
    <>
      <Topbar title="Log in or sign up" type="cancel" />
      <div className="mt-[72px]">
        <Accordion defaultSelectedId="login">
          <AccordionItem id="login" name="auth" label="Log in">
            <LoginForm />
          </AccordionItem>
          <AccordionItem id="signup" name="auth" label="Create account">
            <form onSubmit={handleSubmit}>
              <TextField id="email" name="email" type="text" label="Email" value={email} onChange={handleChangeEmail} />
              <Button variant="solid" color="primary" type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
