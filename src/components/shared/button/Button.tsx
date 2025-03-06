import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { ComponentProps, forwardRef } from 'react';

const buttonVariants = cva(
  'px-8 rounded-[8px] font-semibold inline-flex items-center justify-center focus:outline-none',
  {
    variants: {
      variant: {
        solid: 'text-white disabled:bg-bg-highlight-disabled disabled:text-text-disabled',
        outline: 'disabled:bg-white disabled:text-text-disabled border-border-weak1',
        link: 'px-2 disabled:bg-white disabled:text-text-disabled',
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
          'bg-bg-brand-default hover:bg-bg-brand-hover focus:ring-2 focus:ring-bg-brand-default focus:ring-offset-2 focus:ring-offset-white',
      },
      {
        variant: 'solid',
        color: 'secondary',
        class:
          'bg-text-default hover:bg-border-inverted-hover focus:bg-border-inverted-hover focus:ring-2 focus:ring-border-inverted-hover focus:ring-offset-2 focus:ring-offset-white',
      },
      {
        variant: 'link',
        color: 'primary',
        class:
          'bg-white text-text-brand-default underline hover:bg-bg-highlight-hover active:text-text-brand-pressed active:bg-bg-highlight-disabled',
      },
      {
        variant: 'link',
        color: 'secondary',
        class:
          'bg-white text-text-default underline hover:bg-bg-highlight-hover active:text-text-strong active:bg-bg-highlight-disabled',
      },
      {
        variant: 'outline',
        color: 'primary',
        class:
          'border border-border-brand-default text-text-brand-default hover:bg-bg-brand-weakDown focus:bg-bg-brand-weakDown active:text-text-brand-pressed active:border-text-brand-pressed focus:ring-2 focus:ring-border-brand-default focus:ring-offset-2 focus:ring-offset-white',
      },
      {
        variant: 'outline',
        color: 'secondary',
        class:
          'border border-border-default text-text-default hover:bg-[#0a004b0d] active:bg-bg-highlight-disabled focus:bg-[#0a004b0d] focus:ring-2 focus:ring-[#b1b1b1] focus:ring-offset-2 focus:ring-offset-white',
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
