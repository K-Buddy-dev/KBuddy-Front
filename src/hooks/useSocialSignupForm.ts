import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormData } from '@/types';
import { socialSignupSchema } from '@/utils/validationSchemas';

export const useSocialSignupForm = (
  email: string,
  oAuthUid: string | number,
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null
) => {
  return useForm<SignupFormData>({
    resolver: zodResolver(socialSignupSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: email,
      userId: '',
      birthDate: { year: '', month: '', day: '' },
      country: null,
      gender: null,
      oAuthUid: oAuthUid,
      oAuthCategory: oAuthCategory,
    },
  });
};
