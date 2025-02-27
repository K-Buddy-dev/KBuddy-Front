import apiClient from '@/api/axiosConfig';
import { Button, TextField } from '@/components';
import { useSignupStore } from '@/store';
import { emailFormSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function EmailVerifyForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const setEmail = useSignupStore((state) => state.setEmail);

  const onSubmit = async (data: { email: string }) => {
    try {
      const response = await apiClient.post('/auth/email/send', { email: data.email });

      if (!response.data.status) {
        throw new Error('Invalid email address.');
      }

      setEmail(data.email);
      setErrorMessage('');
      navigate('/signup/verify');
    } catch {
      setErrorMessage('Invalid email address.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => <TextField id="email" label="Email" error={errorMessage} {...field} />}
      />
      <Button variant="solid" color="primary" type="submit" className="w-full" disabled={!isValid}>
        Continue
      </Button>
    </form>
  );
}
