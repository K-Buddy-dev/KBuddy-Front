import React, { ComponentProps, forwardRef, useRef, useState } from 'react';
import { ClearIcon, ErrorOutlineIcon } from '@components/icon';
import { cn } from '@/utils/utils';

interface TextFieldProps extends ComponentProps<'input'> {
  id: string;
  name: string;
  type: string;
  label: string;
  className?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, name, type, label, className, error, value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocus, setIsFocus] = useState(false);
    const handleFocusInput = () => setIsFocus(true);
    const handleBlurInput = () => setIsFocus(false);
    const handleClickClearButton = () => {
      if (onChange) {
        onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      }

      const targetRef = ref && typeof ref !== 'function' ? ref : inputRef;
      targetRef?.current?.focus();
    };
    return (
      <div className="w-full flex flex-col items-start mb-4">
        <label htmlFor={id} className="mb-2">
          {label}
        </label>
        <div className="flex flex-col w-full">
          <div
            className={cn(
              'flex items-center gap-2 w-full pl-4 pr-2 py-3 border border-solid border-gray-400 rounded-lg bg-white',
              isFocus && 'border-2 border-border-focus',
              error && 'border-[#D31510]'
            )}
          >
            <input
              className={cn('flex-1 h-6 bg-transparent outline-none text-gray-900 placeholder-gray-400', className)}
              ref={ref || inputRef}
              {...props}
              value={value}
              onChange={onChange}
              onFocus={handleFocusInput}
              onBlur={handleBlurInput}
            />
            {isFocus && <ClearIcon onClick={handleClickClearButton} />}
          </div>
          {error && (
            <div className="flex items-center gap-1 mt-2">
              <ErrorOutlineIcon />
              <p className="text-[#D31510] text-[12px] font-normal">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextField.displayName = 'TextField';
