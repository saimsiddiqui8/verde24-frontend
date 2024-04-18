import { SyntheticEvent, KeyboardEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputField({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  properties,
  error,
  disabled,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative my-6">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange ? onChange : {}}
        onKeyDown={onKeyDown}
        disabled={disabled}
        {...properties}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer"
        style={{ border: error ? "1px solid crimson" : "" }}
      />
      <label
        className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-[5] origin-[0] whitespace-nowrap bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        style={{ color: error ? "crimson" : "" }}
      >
        {label}
      </label>
      {type === "password" && (
        <div
          className="absolute right-3 top-4 text-primary cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}
      {error && (
        <small className="text-red-500 font-medium uppercase">
          {error?.message}
        </small>
      )}
    </div>
  );
}

interface InputFieldProps {
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: SyntheticEvent) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  properties?: any;
  error?: any;
  disabled?: boolean;
}
