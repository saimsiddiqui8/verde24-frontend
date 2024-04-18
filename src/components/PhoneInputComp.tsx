import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function PhoneInputComp({
  label,
  value,
  onChange,
  properties,
  error,
  disabled,
}: PhoneInputProps) {
  return (
    <div className="relative">
      <PhoneInput
        defaultCountry="ng"
        value={value}
        {...properties}
        disabled={disabled}
        onChange={onChange ? onChange : null}
        className="flex my-6 px-2.5 pt-2 pb-0.5 w-full text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer"
      />
      <label className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-[5] origin-[0] whitespace-nowrap bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
        {label === "" ? "" : "Phone Number"}
      </label>
      {error && (
        <small className="text-red-500 font-medium uppercase absolute -bottom-5">
          {error?.message}
        </small>
      )}
    </div>
  );
}

interface PhoneInputProps {
  label?: string;
  value?: string;
  onChange?: (e: any) => void;
  error?: any;
  properties?: any;
  disabled?: boolean;
}
