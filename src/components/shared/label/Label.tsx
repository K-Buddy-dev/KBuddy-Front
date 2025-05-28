import { ComponentProps } from 'react';

interface LabelProps extends ComponentProps<'label'> {
  htmlFor: string;
  label: string;
}

export function Label(props: LabelProps) {
  const { htmlFor, label } = props;
  return (
    <label htmlFor={htmlFor} className="mb-2">
      {label}
    </label>
  );
}
