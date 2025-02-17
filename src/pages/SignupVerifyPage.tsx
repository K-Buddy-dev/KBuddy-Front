import apiClient from '@/api/axiosConfig';
import { Button, TextField, Topbar } from '@/components';
import { useSignupStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export function SignupVerifyPage() {
  const { email } = useSignupStore();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ code: string }>({
    resolver: zodResolver(z.object({ code: z.string().length(6) })),
    defaultValues: {
      code: '',
    },
    mode: 'onSubmit',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleClickBackButton = () => {
    navigate('/');
  };

  const onSubmit = async (data: { code: string }) => {
    try {
      const response = await apiClient.post('/auth/email/code', { email: email, code: data.code });

      if (!response.data.status) {
        throw new Error('Invalid confirmation code.');
      }

      setErrorMessage('');
      navigate('/signup/form');
    } catch {
      setErrorMessage('Invalid confirmation code.');
    }
  };

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      <form className="mt-[72px] flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-6 pb-4 w-full">
          <h1 className="font-medium text-title-100-medium text-text-default">Enter the confirmation code</h1>
          <p className="font-normal text-body-100-medium text-text-default mt-1">
            Confirmation sent. To continue, check your email & enter the 6-digit code we sent to {email}
          </p>
        </div>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <TextField id="code" type="text" label="Confirmation code" error={errorMessage} {...field} />
          )}
        />
        <Button variant="solid" color="primary" className="w-full mt-[184px]" disabled={!isValid}>
          Next
        </Button>
        <span className="text-text-brand-default font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer mt-[13px]">
          I didn't get the code
        </span>
      </form>
    </>
  );
}
