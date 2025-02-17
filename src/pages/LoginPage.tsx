import apiClient from '@/api/axiosConfig';
import { Accordion, AccordionItem, Button, TextField, Topbar } from '@/components';
import { LoginForm } from '@/contents/login/LoginForm';
import { emailSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '@/store';

export function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(emailSchema),
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
      const response = await apiClient.post('/user/auth/email/send', { email: data.email });

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
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
