import { cva } from 'class-variance-authority';
import { ComponentProps, forwardRef, useEffect, useRef, useState } from 'react';
import { DownArrow, UpArrow } from '../icon';

const selectBoxVariants = cva('w-[100px] flex flex-col items-start relative', {
  variants: {
    size: {
      small: 'w-[100px]',
      medium: 'w-[200px]',
      large: 'w-full',
    },
  },
});

interface SelectBoxProps extends Omit<ComponentProps<'div'>, 'size' | 'onChange'> {
  label: string;
  size?: 'small' | 'medium' | 'large';
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
}

export const SelectBox = forwardRef<HTMLDivElement, SelectBoxProps>(
  ({ size = 'small', label, options, onChange, value, ...props }, _) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectBoxRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className={selectBoxVariants({ size })} ref={selectBoxRef} {...props} onClick={() => setIsOpen(!isOpen)}>
        <div
          className={`flex justify-between items-center w-full border border-solid border-border-default bg-white box-border text-gray-900 placeholder-gray-400 py-3 px-4 cursor-pointer relative ${
            isOpen ? 'border-b-0 rounded-t-[8px]' : 'rounded-[8px]'
          }`}
        >
          <div>{selectedOption?.label || label}</div>
          <div>{isOpen ? <UpArrow /> : <DownArrow />}</div>
        </div>
        {isOpen && (
          <ul className="absolute top-full left-0 w-full h-[160px] overflow-y-scroll border border-solid border-border-default border-t-0 rounded-b-[8px] bg-white z-10">
            {options.map((option) => (
              <li
                key={option.value}
                className="py-2 px-4 hover:bg-bg-highlight-hover cursor-pointer"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
