import { ComponentProps } from 'react';

interface LabelProps extends ComponentProps<'label'> {
  id: string;
  label: string;
}

export function Label(props: LabelProps) {
  const { id, label } = props;
  return (
    <label htmlFor={id} className="mb-2">
      {label}
    </label>
  );
}
