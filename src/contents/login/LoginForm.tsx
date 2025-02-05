import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, TextField, PasswordField } from '@/components';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validationSchemas';

export function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const handleClickForgotPassword = () => {
    navigate('/forgot');
  };

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="username"
        render={({ field }) => <TextField id="username" label="Email address or user ID" {...field} />}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => <PasswordField id="password" label="Password" {...field} />}
      />
      <div className="w-full h-8 mb-6 flex items-center justify-between">
        <Checkbox label="Remember me" />
        <span
          className="text-text-brand-default font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer"
          onClick={handleClickForgotPassword}
        >
          Forgot password?
        </span>
      </div>
      <Button variant="solid" color="primary" className="w-full">
        Log in
      </Button>
    </form>
  );
}
