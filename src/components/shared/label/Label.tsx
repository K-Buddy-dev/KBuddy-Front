import { ComponentProps } from 'react';

interface LabelProps extends ComponentProps<'label'> {
  htmlFor: string;
  label: string;
  required?: boolean;
}

export function Label(props: LabelProps) {
  const { htmlFor, label, required } = props;
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1">
      {label}
      {required && <span className="text-text-danger-default">*</span>}
    </label>
  );
}
