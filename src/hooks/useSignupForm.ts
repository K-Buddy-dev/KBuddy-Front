import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormData } from '@/types';
import { signupSchema } from '@/utils/validationSchemas';

export const useSignupForm = (email: string) => {
  return useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: email,
      userId: '',
      password: '',
      confirmPassword: '',
      birthDate: { year: '', month: '', day: '' },
      country: null,
      gender: null,
    },
  });
};
