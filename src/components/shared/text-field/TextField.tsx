import React, { ComponentProps, forwardRef, useRef, useState } from 'react';
import { ClearIcon, ErrorOutlineIcon } from '@/components/shared/icon';
import { cn } from '@/utils/utils';
import { Label } from '@/components/shared/label/Label';
import { cva } from 'class-variance-authority';

const textFieldVariants = cva(
  'relative w-full py-3 pl-4 pr-2 border border-solid border-border-default rounded-[8px] bg-white box-border',
  {
    variants: {
      state: {
        focus: 'border-2 border-border-hover',
        error: 'border-border-danger-default',
        'error-focus': 'border-2 border-border-danger-default',
        disabled: 'bg-bg-highlight-disabled',
      },
    },
  }
);

interface TextFieldProps extends ComponentProps<'input'> {
  id: string;
  label: string;
  className?: string;
  error?: string;
}

const checkState = (disabled: boolean | undefined, isFocus: boolean, error: string | undefined) => {
  if (disabled) return 'disabled';
  if (isFocus && error) return 'error-focus';
  if (isFocus) return 'focus';
  if (error) return 'error';
  return undefined;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, name, label, error, value, onChange, onBlur, required, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFocus, setIsFocus] = useState(false);

    const handleFocusInput = () => setIsFocus(true);

    const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocus(false);
      onBlur?.(e);
    };

    const handleClickClearButton = () => {
      onChange?.({
        target: { value: '', name, id },
      } as React.ChangeEvent<HTMLInputElement>);

      inputRef.current?.focus();
    };

    return (
      <div className="w-full flex flex-col items-start mb-4">
        <Label htmlFor={id} label={label} required={required} />
        <div
          className={cn(
            textFieldVariants({
              state: checkState(props.disabled, isFocus, error),
            })
          )}
        >
          <input
            id={id}
            type="text"
            className="w-full pr-10 flex-1 h-6 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            ref={ref || inputRef}
            value={value}
            onChange={onChange}
            {...props}
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
            <p className="text-text-danger-default text-[12px] font-normal">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
