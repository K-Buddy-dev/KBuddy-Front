import { LoginFormData } from '@/types';
import { loginSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useLoginForm = () => {
  const emailOrUserId = localStorage.getItem('kBuddyId') || '';
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUserId: emailOrUserId,
      password: '',
    },
  });
};
