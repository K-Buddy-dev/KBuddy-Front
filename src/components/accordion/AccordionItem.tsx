import React from 'react';
import { cn } from '@/utils/utils.ts';
import { SelectedRadioIcon, UnSelectedRadioIcon } from '../icon';

export interface AccordionItemProps {
  children: React.ReactNode;
  id: string;
  label: string;
  name: string;
  checked?: boolean;
  onChange?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function AccordionItem({ children, id, label, name, checked, onChange, isFirst, isLast }: AccordionItemProps) {
  return (
    <div className="border-b border-[#6952F9] last:border-b-0">
      <div
        className={cn(
          'flex items-center gap-2 p-4 border-solid border-[#6952F9]',
          checked ? 'bg-[#E2DEFD]' : 'bg-[#F4F4F4]',
          isFirst && 'border-b',
          isLast && !checked && 'border-t',
          isLast && checked && 'border-b'
        )}
      >
        <input type="radio" id={id} name={name} checked={checked} onChange={() => onChange?.(id)} className="hidden" />
        <label htmlFor={id} className="flex items-center gap-2 cursor-pointer w-full">
          {checked ? <SelectedRadioIcon /> : <UnSelectedRadioIcon />}
          <span className="text-[#222] font-roboto text-lg font-medium leading-6 tracking-[0.15px]">{label}</span>
        </label>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: checked ? 'none' : 0,
        }}
      >
        <div className="pt-4 pb-6 px-4">{children}</div>
      </div>
    </div>
  );
}
