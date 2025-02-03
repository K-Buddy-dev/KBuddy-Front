import React, { ComponentProps, forwardRef, useRef, useState } from 'react';
import { ClearIcon, ErrorOutlineIcon } from '@components/icon';
import { cn } from '@/utils/utils';
import { Label } from '@/label/Label';
import { cva } from 'class-variance-authority';

const textFieldVariants = cva(
  'relative w-full py-3 pl-4 pr-2 border border-solid border-[#B1B1B1] rounded-lg bg-white box-border',
  {
    variants: {
      state: {
        focus: 'border-2 border-[#464646]',
        error: 'border-[#D31510]',
        'error-focus': 'border-2 border-[#D31510]',
      },
    },
  }
);

interface TextFieldProps extends ComponentProps<'input'> {
  id: string;
  name: string;
  label: string;
  className?: string;
  error?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, name, label, className, error, value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocus, setIsFocus] = useState(false);

    const handleFocusInput = () => setIsFocus(true);

    const handleBlurInput = () => setIsFocus(false);

    const handleClickClearButton = () => {
      const targetRef = ref && typeof ref !== 'function' ? ref : inputRef;

      onChange({
        target: { value: '', name, id },
      } as React.ChangeEvent<HTMLInputElement>);

      if (targetRef.current) {
        targetRef.current.value = '';
      }

      targetRef.current?.focus();
    };
    return (
      <div className="w-full flex flex-col items-start mb-4">
        <Label id={id} label={label} />
        <div className={cn(textFieldVariants({ state: isFocus ? 'focus' : undefined }))}>
          <input
            className="w-full pr-10 flex-1 h-6 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            ref={ref || inputRef}
            {...props}
            value={value}
            onChange={onChange}
            onFocus={handleFocusInput}
            onBlur={handleBlurInput}
          />
          {value && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              onClick={handleClickClearButton}
            >
              <ClearIcon />
            </button>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1 mt-2">
            <ErrorOutlineIcon />
            <p className="text-[#D31510] text-[12px] font-normal">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
