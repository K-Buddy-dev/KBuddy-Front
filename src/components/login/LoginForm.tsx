import { Button, Checkbox, TextField, PasswordField } from '@/components/shared';
import { Controller } from 'react-hook-form';
import { LoginFormData } from '@/types';
import { useLoginForm, useLogin } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../shared/spinner';

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();
  const { login, error, isLoading, isCheckedRemember, setIsCheckRemember } = useLogin();
  const navigate = useNavigate();

  const handleClickForgotPassword = () => {
    navigate('/forgot');
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/community');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="emailOrUserId"
        render={({ field }) => (
          <TextField
            id="emailOrUserId"
            label="Email address or user ID"
            error={errors.emailOrUserId?.message || error.emailOrUserId}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordField id="password" label="Password" error={errors.password?.message || error.password} {...field} />
        )}
      />
      <div className="w-full h-8 mb-6 flex items-center justify-between">
        <Checkbox
          label="Remember me"
          checked={isCheckedRemember}
          onChange={(e) => setIsCheckRemember(e.target.checked)}
        />
        <span
          className="text-text-brand-default text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer"
          onClick={handleClickForgotPassword}
        >
          Forgot password?
        </span>
      </div>
      <Button type="submit" variant="solid" color="primary" className="w-full">
        {isLoading ? <Spinner color="primary" size="sm" /> : 'Log in'}
      </Button>
    </form>
  );
}
