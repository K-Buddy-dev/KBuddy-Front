import { ComponentProps, forwardRef } from 'react';
import { Label } from '@/label/Label';
import { SelectedRadioIcon, UnSelectedRadioIcon } from '@/components/icon';

interface RadioButtonOption {
  label: string;
  value: string;
}

interface RadioButtonGroupProps extends ComponentProps<'input'> {
  id: string;
  label: string;
  options: RadioButtonOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const RadioButtonGroup = forwardRef<HTMLInputElement, RadioButtonGroupProps>(
  ({ id, label, options, value, onChange, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col items-start mb-4">
        <Label id={id} label={label} />
        <div className="flex">
          {options.map((option) => (
            <label key={option.value} className="mr-4 flex items-center gap-2">
              <input
                type="radio"
                name={id}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
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
