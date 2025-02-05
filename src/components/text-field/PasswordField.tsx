import { ComponentProps, forwardRef, useState } from 'react';
import {
  ErrorOutlineIcon,
  ValidationPassIcon,
  ValidationErrorIcon,
  EyesIcon,
  EyesSlashIcon,
  ValidationIcon,
} from '@components/icon';
import { cn } from '@/utils/utils';
import { Label } from '@/label/Label';
import { cva } from 'class-variance-authority';
import { passwordValidationRules } from '@/utils/validationSchemas';

const passwordVariants = cva(
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

interface PasswordFieldProps extends ComponentProps<'input'> {
  id: string;
  label: string;
  className?: string;
  error?: string;
  showValidation?: boolean;
}

const checkState = (disabled: boolean | undefined, isFocus: boolean, error: string | undefined) => {
  if (disabled) return 'disabled';
  if (isFocus && error) return 'error-focus';
  if (isFocus) return 'focus';
  if (error) return 'error';
  return undefined;
};

const getValidationState = (value: string, ruleValid: boolean) => {
  if (value.length === 0) return { icon: <ValidationIcon />, color: 'text-[#6D6D6D]' };
  return ruleValid
    ? { icon: <ValidationPassIcon />, color: 'text-[#007A4D]' }
    : { icon: <ValidationErrorIcon />, color: 'text-[#D31510]' };
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, label, error, value, onChange, showValidation = false, ...props }, ref) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocusInput = () => setIsFocus(true);
    const handleBlurInput = () => setIsFocus(false);
    const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

    return (
      <div className="w-full flex flex-col items-start mb-4">
        <Label id={id} label={label} />
        <div
          className={cn(
            passwordVariants({
              state: checkState(props.disabled, isFocus, error),
            })
          )}
        >
          <input
            className="w-full pr-10 flex-1 h-6 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            ref={ref}
            {...props}
            value={value}
            onChange={onChange}
            type={isPasswordVisible ? 'text' : 'password'}
            onFocus={handleFocusInput}
            onBlur={handleBlurInput}
          />
          {value && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <EyesSlashIcon /> : <EyesIcon />}
            </button>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1 mt-2">
            <ErrorOutlineIcon />
            <p className="text-[#D31510] text-[12px] font-normal">{error}</p>
          </div>
        )}
        {showValidation && (
          <div className="mt-2">
            {passwordValidationRules.map((rule, index) => {
              const { icon, color } = getValidationState(value as string, rule.test(value as string));

              return (
                <p key={index} className={cn('text-xs flex items-center gap-1', color)}>
                  {icon} {rule.label}
                </p>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
