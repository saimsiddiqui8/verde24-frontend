import { InputHTMLAttributes } from "react";
export default function TimePicker({ label, properties, error }: InputProps) {
  return (
    <div>
      <label>{label}:</label>
      <input
        type="time"
        className="block border border-primary outline-none w-full mt-1 p-2"
        {...properties}
      />
      {error && (
        <small className="text-red-500 font-medium uppercase">
          {error?.message}
        </small>
      )}
    </div>
  );
}

interface ErrorType {
  message?: string;
  code?: string;
  details?: string;
}
interface InputProps {
  label: string;
  properties?: InputHTMLAttributes<HTMLInputElement> | object;
  error?: ErrorType | undefined;
}
