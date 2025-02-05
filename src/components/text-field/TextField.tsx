import React, { ComponentProps, forwardRef, useRef, useState } from 'react';
import { ClearIcon, ErrorOutlineIcon } from '@components/icon';
import { cn } from '@/utils/utils';
import { Label } from '@/label/Label';
import { cva } from 'class-variance-authority';

const textFieldVariants = cva(
  'relative w-full py-3 pl-4 pr-2 border border-solid border-[#B1B1B1] rounded-[8px] bg-white box-border',
  {
    variants: {
      state: {
        focus: 'border-2 border-[#464646]',
        error: 'border-[#D31510]',
        'error-focus': 'border-2 border-[#D31510]',
        disabled: 'bg-[#0A004B1A]',
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
  ({ id, name, label, error, value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFocus, setIsFocus] = useState(false);

    const handleFocusInput = () => setIsFocus(true);

    const handleBlurInput = () => setIsFocus(false);

    const handleClickClearButton = () => {
      onChange?.({
        target: { value: '', name, id },
      } as React.ChangeEvent<HTMLInputElement>);
      inputRef.current?.focus();
    };

    return (
      <div className="w-full flex flex-col items-start mb-4">
        <Label id={id} label={label} />
        <div
          className={cn(
            textFieldVariants({
              state: checkState(props.disabled, isFocus, error),
            })
          )}
        >
          <input
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
            <p className="text-[#D31510] text-[12px] font-normal">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
