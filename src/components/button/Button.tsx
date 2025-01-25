import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/utils';
import React from 'react';

const buttonVariants = cva('w-[296px] h-12 rounded-lg text-center font-roboto text-base font-semibold leading-none', {
  variants: {
    variant: {
      primary: 'bg-primary text-white',
      secondary: 'bg-primary-100/10 text-gray-400',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, ...props }, ref) => {
  return <button ref={ref} className={cn(buttonVariants({ variant, className }))} {...props} />;
});
