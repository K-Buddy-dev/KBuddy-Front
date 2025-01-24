import React from 'react';
import { cn } from '../../utils/utils.ts';

interface AccordionProps {
  children: React.ReactNode;
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function AccordionItem({ children, id, label, name, checked, onChange, isFirst, isLast }: AccordionProps) {
  return (
    <div className="border-b border-primary last:border-b-0">
      <div
        className={cn(
          'flex items-center gap-2 p-4 border-solid border-primary',
          checked ? 'bg-[#E2DEFD]' : 'bg-[#F4F4F4]',
          isFirst && 'border-b',
          isLast && !checked && 'border-t',
          isLast && checked && 'border-b'
        )}
      >
        <input type="radio" id={id} name={name} checked={checked} onChange={() => onChange(id)} className="hidden" />
        <label htmlFor={id} className="flex items-center gap-2 cursor-pointer w-full">
          {checked ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                fill="#6952F9"
              />
              <path
                d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                fill="#6952F9"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                fill="#222222"
              />
            </svg>
          )}
          <span className="text-[#222] font-roboto text-lg font-medium leading-6 tracking-[0.15px]">{label}</span>
        </label>
      </div>
      {checked && <div className="pt-4 pb-6 px-4">{children}</div>}
    </div>
  );
}
