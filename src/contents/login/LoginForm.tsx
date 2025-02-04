import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, TextField, PasswordField } from '@/components';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validationSchemas';
import { LoginFormData } from '@/types';

export function LoginForm() {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  const handleClickForgotPassword = () => {
    navigate('/forgot');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id="username"
        label="Email address or user ID"
        control={control}
        setValue={setValue}
        register={register('username')}
        error={errors.username?.message}
      />
      <PasswordField
        id="password"
        label="Password"
        control={control}
        register={register('password')}
        error={errors.password?.message}
      />
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
