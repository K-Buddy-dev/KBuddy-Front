interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
}

export function FormInput(props: FormInputProps) {
  const { id, name, type, label } = props;

  return (
    <div className="w-full flex flex-col items-start mb-4">
      <label htmlFor={id} className="mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="w-full h-12 border border-solid border-custom-gray rounded-lg focus:outline-2 focus:outline-[#464646] px-[16px] py-3"
      />
    </div>
  );
}
