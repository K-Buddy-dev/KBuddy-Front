import { Button, TextField } from '@/components/shared';
import { useEmailVerifyActionContext, useEmailVerifyForm, useEmailVerifyStateContext } from '@/hooks';
import { authService } from '@/services';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../shared/spinner';

export function EmailVerifyForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useEmailVerifyForm();
  const { error, isLoading } = useEmailVerifyStateContext();
  const { setEmail, emailVerify } = useEmailVerifyActionContext();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string }) => {
    try {
      const result = await emailVerify(data);
      if (result) {
        authService.sendCode(data);
        setEmail(data.email);
        navigate('/signup/verify');
      }
    } catch (error) {
      console.error('Email verification failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => <TextField id="email" label="Email" error={error} {...field} />}
      />
      <Button variant="solid" color="primary" type="submit" className="w-full" disabled={!isValid}>
        {isLoading ? <Spinner color="primary" size="sm" /> : 'Continue'}
      </Button>
    </form>
  );
}
