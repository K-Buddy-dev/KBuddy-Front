import { Button, TextField } from '@/components';
import { useEmailVerify, useEmailVerifyForm } from '@/hooks';
import { useSignupStore } from '@/store';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function EmailVerifyForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useEmailVerifyForm();
  const { emailVerify, error, isLoading } = useEmailVerify();
  const setEmail = useSignupStore((state) => state.setEmail);
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string }) => {
    await emailVerify(data);
    setEmail(data.email);
    navigate('/signup/verify');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => <TextField id="email" label="Email" error={error} {...field} />}
      />
      <Button variant="solid" color="primary" type="submit" className="w-full" disabled={!isValid}>
        {isLoading ? 'Sending...' : 'Continue'}
      </Button>
    </form>
  );
}
