import { emailFormSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useEmailVerifyForm = () => {
  return useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });
};
