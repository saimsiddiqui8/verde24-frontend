import { FC } from "react";

interface Option {
  label: string;
  value: string;
}

interface FieldProps {
  options: Option[];
  placeholder?: string;
  label?: string;
  name: string;
  properties?: any;
  error?: any;
  className?: string;
  disabled?: boolean;
}

const Field: FC<FieldProps> = ({
  name,
  options,
  placeholder = "Select an option",
  label,
  properties,
  error,
  className,
  disabled = false,
}) => {
  return (
    <div className={`relative my-6 ${className}`}>
      <select
        id={name}
        name={name}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer ${
          error ? "border-crimson" : ""
        }`}
        {...properties}
        disabled={disabled}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className={`absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] whitespace-nowrap bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 ${
          error ? "text-crimson" : ""
        }`}
        style={{ color: error ? "crimson" : "" }}
      >
        {label}
      </label>
      {error && (
        <small className="text-red-500 font-medium uppercase">
          {error.message}
        </small>
      )}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
          <path d="M5.23 7.21a.75.75 0 011.04.02L10 10.958l3.73-3.73a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.04z" />
        </svg>
      </div>
    </div>
  );
};

export default Field;
