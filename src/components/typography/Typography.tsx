import { cn } from '@/utils/utils';
import { cva } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      title: 'font-medium text-title-100-medium text-text-default',
      description: 'font-normal text-body-100-medium text-text-default',
    },
  },
  defaultVariants: {
    variant: 'description',
  },
});

interface TypographyProps extends ComponentProps<'p'> {
  variant?: 'title' | 'description';
  children: ReactNode;
}

export function Typography({ variant, children, className, ...props }: TypographyProps) {
  return (
    <p className={cn(typographyVariants({ variant }), className)} {...props}>
      {children}
    </p>
  );
}

Typography.displayName = 'Typography';
