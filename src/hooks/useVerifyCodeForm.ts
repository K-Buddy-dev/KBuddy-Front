import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useVerifyCodeForm = () => {
  return useForm<{ code: string }>({
    resolver: zodResolver(z.object({ code: z.string().length(6) })),
    defaultValues: {
      code: '',
    },
    mode: 'onSubmit',
  });
};
