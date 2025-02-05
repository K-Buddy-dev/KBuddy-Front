import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { ComponentProps, forwardRef } from 'react';

const buttonVariants = cva(
  'px-8 rounded-[8px] font-roboto font-semibold inline-flex items-center justify-center focus:outline-none',
  {
    variants: {
      variant: {
        solid: 'text-white disabled:bg-[#0a004b1a] disabled:text-[#B1B1B1]',
        outline: 'disabled:bg-white disabled:text-[#B1B1B1] border-[#d5d5d5]',
        link: 'px-2 disabled:bg-white disabled:text-[#B1B1B1]',
      },
      color: {
        primary: '',
        secondary: '',
      },
      size: {
        small: 'h-[30px] px-3 text-xs font-medium',
        medium: 'h-10 py-[10px] text-sm',
        large: 'h-12 text-base',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        color: 'primary',
        class:
          'bg-[#6952F9] hover:bg-[#5a44d7] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white',
      },
      {
        variant: 'solid',
        color: 'secondary',
        class:
          'bg-[#222222] hover:bg-[#6d6d6d] focus:bg-[#6d6d6d] focus:ring-2 focus:ring-[#6d6d6d] focus:ring-offset-2 focus:ring-offset-white',
      },
      {
        variant: 'link',
        color: 'primary',
        class: 'bg-white text-primary underline hover:bg-[#0a004b0d] active:text-[#4937B3] active:bg-[#0a004b1a]',
      },
      {
        variant: 'link',
        color: 'secondary',
        class: 'bg-white text-[#222222] underline hover:bg-[#0a004b0d] active:text-[#111111] active:bg-[#0a004b1a]',
      },
      {
        variant: 'outline',
        color: 'primary',
        class:
          'border border-primary text-primary hover:bg-[#f6f4fe] focus:bg-[#f6f4fe] active:text-[#4937B3] active:border-[#4937B3] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white',
      },
      {
        variant: 'outline',
        color: 'secondary',
        class:
          'border border-[#b1b1b1] text-[#222222] hover:bg-[#0a004b0d] active:bg-[#0a004b1a] focus:bg-[#0a004b0d] focus:ring-2 focus:ring-[#b1b1b1] focus:ring-offset-2 focus:ring-offset-white',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'large',
    },
  }
);

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color, size, variant, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, color, size, className }))} {...props} />;
  }
);

Button.displayName = 'Button';
