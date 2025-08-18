import { ComponentProps, forwardRef } from 'react';
import { Label } from '@/components/shared/label/Label';
import { SelectedRadioIcon, UnSelectedRadioIcon } from '@/components/shared/icon';

interface RadioButtonOption {
  label: string;
  value: string;
}

interface RadioButtonGroupProps extends Omit<ComponentProps<'input'>, 'value' | 'onChange'> {
  id: string;
  label: string;
  options: RadioButtonOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
}

export const RadioButtonGroup = forwardRef<HTMLInputElement, RadioButtonGroupProps>(
  ({ id, label, options, value, onChange, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col items-start mb-4">
        <Label htmlFor={id} label={label} />
        <div className="flex">
          {options.map((option) => (
            <label key={option.value} className="mr-4 flex items-center gap-2">
              <input
                type="radio"
                name={id}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value || null)}
                ref={ref}
                className="hidden"
                {...props}
              />
              {value === option.value ? <SelectedRadioIcon /> : <UnSelectedRadioIcon />}
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {error && <span className="text-danger-default text-[12px] font-normal">{error}</span>}
      </div>
    );
  }
);

RadioButtonGroup.displayName = 'RadioButtonGroup';
