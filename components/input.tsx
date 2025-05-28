import { InputHTMLAttributes } from "react";

interface FormInputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...props
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  console.log(props);
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-3 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 px-3"
        {...props}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
