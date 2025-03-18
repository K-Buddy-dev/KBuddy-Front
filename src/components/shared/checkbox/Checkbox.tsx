import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { ComponentProps, forwardRef, useState } from 'react';
import { CheckedIcon, UnCheckedIcon } from '../icon';

const checkboxVariants = cva('flex items-center justify-between cursor-pointer', {
  variants: {
    size: {
      default: 'w-[141px] h-full px-2 py-1 text-sm font-normal leading-5 tracking-[0.1px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'size'>, VariantProps<typeof checkboxVariants> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
          {isChecked ? <CheckedIcon /> : <UnCheckedIcon />}
        </div>
        <span className="text-sm font-normal">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
