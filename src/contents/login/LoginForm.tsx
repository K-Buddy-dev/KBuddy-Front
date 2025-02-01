import { useNavigate } from 'react-router-dom';
import { Button } from '@components/button/Button.tsx';
import { Checkbox } from '@components/checkbox/Checkbox.tsx';
import { FormInput } from '@components/form/FormInput.tsx';

export function LoginForm() {
  const navigate = useNavigate();
  const handleClickForgotPassword = () => {
    navigate('/forgot');
  };
  return (
    <form>
      <FormInput id="username" name="username" type="text" label="Email address or user ID" />
      <FormInput id="password" name="password" type="password" label="Password" />
      <div className="w-full h-8 mb-6 flex items-center justify-between">
        <Checkbox label="Remember me" />
        <span
          className="text-primary font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer"
          onClick={handleClickForgotPassword}
        >
          Forgot password?
        </span>
      </div>
      <Button className="w-full">Log in</Button>
    </form>
  );
}
