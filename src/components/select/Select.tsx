import { ComponentProps, forwardRef } from 'react';
import { DownArrow } from '../icon';
import { cva } from 'class-variance-authority';

const selectVariants = cva('w-[100px] flex flex-col items-start relative', {
  variants: {
    size: {
      small: 'w-[100px]',
      medium: 'w-[200px]',
      large: 'w-full',
    },
  },
});

interface SelectProps extends Omit<ComponentProps<'select'>, 'size'> {
  name: string;
  size?: 'small' | 'medium' | 'large';
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, size = 'small', options, onChange, ...props }, ref) => {
    return (
      <div className={selectVariants({ size })}>
        <select
          name={name}
          id={name}
          {...props}
          ref={ref}
          onChange={onChange}
          className="appearance-none w-full border border-solid border-border-default rounded-[8px] bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4 pr-10 focus:outline-none focus:border-2 focus:border-border-hover"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <DownArrow />
        </div>
      </div>
    );
  }
);
