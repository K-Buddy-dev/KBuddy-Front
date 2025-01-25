import { Button } from '../../components/button/Button.tsx';
import { Checkbox } from '../../components/checkbox/Checkbox.tsx';
import { FormInput } from '../../components/form/FormInput.tsx';

export function LoginForm() {
  return (
    <form>
      <FormInput id="username" name="username" type="text" label="Email address or user ID" />
      <FormInput id="password" name="password" type="password" label="Password" />
      <div className="w-full h-8 mb-6 flex items-center justify-between">
        <Checkbox label="Remember me" />
        <a
          href="#"
          className="text-primary font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline"
        >
          Forgot password?
        </a>
      </div>
      <Button>Log in</Button>
    </form>
  );
}
