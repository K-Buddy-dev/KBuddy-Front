import { ComponentProps, ReactNode } from 'react';

interface LabelProps extends ComponentProps<'label'> {
  htmlFor: string;
  label: ReactNode;
  required?: boolean;
  isTitle?: boolean;
}

export function Label(props: LabelProps) {
  const { htmlFor, label, required, isTitle } = props;
  return (
    <label htmlFor={htmlFor} className={`${isTitle && 'mb-2'} flex items-center gap-1`}>
      {label}
      {required && <span className="text-text-danger-default">*</span>}
    </label>
  );
}
