import { Button, PasswordField, TextField, Topbar } from '@/components';
import { useSignupStore } from '@/store';
import { signupSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password: string;
  confirmPassword: string;
}

export function SignupFormPage() {
  const { email } = useSignupStore();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: email,
      userId: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleClickBackButton = () => {
    navigate('/');
  };

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
  };

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      <div className="mt-[72px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <TextField id="firstName" label="First name" {...field} error={errors.firstName?.message} />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextField id="lastName" label="Last name" {...field} error={errors.lastName?.message} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField id="email" label="Email" disabled={true} {...field} error={errors.email?.message} />
            )}
          />
          <Controller
            control={control}
            name="userId"
            render={({ field }) => <TextField id="userId" label="User ID" {...field} error={errors.userId?.message} />}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordField
                id="password"
                label="Password"
                {...field}
                error={errors.password?.message}
                showValidation={true}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                {...field}
                error={errors.confirmPassword?.message}
                showValidation={true}
              />
            )}
          />
          <Button variant="solid" color="primary" className="w-full">
            Create account
          </Button>
        </form>
      </div>
    </>
  );
}
