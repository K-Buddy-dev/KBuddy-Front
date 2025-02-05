import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, TextField, PasswordField } from '@/components';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validationSchemas';

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
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
        name="email"
        render={({ field }) => (
          <TextField id="email" label="Email address or user ID" {...field} error={errors.email?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordField id="password" label="Password" {...field} error={errors.password?.message} />
        )}
      />
      <div className="w-full h-8 mb-6 flex items-center justify-between">
        <Checkbox label="Remember me" />
        <span
          className="text-[#6952F9] font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer"
          onClick={handleClickForgotPassword}
        >
          Forgot password?
        </span>
      </div>
      <Button type="submit" variant="solid" color="primary" className="w-full">
        Log in
      </Button>
    </form>
  );
}
