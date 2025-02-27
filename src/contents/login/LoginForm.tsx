import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, TextField, PasswordField } from '@/components';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validationSchemas';
import apiClient from '@/api/axiosConfig';
import { useState } from 'react';

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUserId: '',
      password: '',
    },
  });

  const [serverError, setServerError] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleClickForgotPassword = () => {
    navigate('/forgot');
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiClient.post('/auth/login', {
        emailOrUserId: data.emailOrUserId,
        password: data.password,
      });
      if (!response.data.status) {
        throw new Error('Invalid email address.');
      }

      setServerError({});
      navigate('/community');
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setServerError({
        email: errorMessage,
        password: errorMessage,
      });
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
            error={errors.emailOrUserId?.message || serverError.emailOrUserId}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordField
            id="password"
            label="Password"
            error={errors.password?.message || serverError.password}
            {...field}
          />
        )}
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
      <Button type="submit" variant="solid" color="primary" className="w-full">
        Log in
      </Button>
    </form>
  );
}
