import { useState } from 'react';
import { Input } from '../input/Input';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
}

export function FormInput(props: FormInputProps) {
  const { id, name, type, label } = props;
  const [value, setValue] = useState('');

  const handleReset = () => {
    setValue('');
  };

  return (
    <div className="w-full flex flex-col items-start mb-4">
      <label htmlFor={id} className="mb-2">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onReset={handleReset}
      />
    </div>
  );
}
