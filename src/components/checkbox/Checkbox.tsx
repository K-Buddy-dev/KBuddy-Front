import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/utils';
import React, { useState } from 'react';

const checkboxVariants = cva('flex items-center cursor-pointer', {
  variants: {
    size: {
      default: 'w-[141px] h-full px-2 py-1 gap-[11px] font-roboto text-sm font-normal leading-5 tracking-[0.1px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, label, onChange, checked, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked || false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
      onChange?.(e);
    };

    return (
      <label className={cn(checkboxVariants({ size, className }))}>
        <input type="checkbox" checked={checked} onChange={handleChange} className="hidden" ref={ref} {...props} />
        <div className="h-6 w-6 flex items-center justify-center">
          {isChecked ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM6 12.4L10 16.4L18 8.4L16.6 7L10 13.6L7.4 11L6 12.4Z"
                fill="#6952F9"
              />
            </svg>
          ) : (
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16 2.33984H2L2 16.3398H16V2.33984ZM2 0.339844C0.895431 0.339844 0 1.23527 0 2.33984V16.3398C0 17.4444 0.89543 18.3398 2 18.3398H16C17.1046 18.3398 18 17.4444 18 16.3398V2.33984C18 1.23527 17.1046 0.339844 16 0.339844H2Z"
                fill="#222222"
              />
            </svg>
          )}
        </div>
        {label}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
