const DropdownField = ({
  name,
  options,
  placeholder,
  label,
  properties,
  error,
  disabled,
}: DropdownFieldProps) => {
  return (
    <div className="my-6">
      <div
        className="text-primary w-full cursor-pointer outline-none font-medium rounded-lg border border-primary relative text-sm text-center flex justify-between items-center pr-1"
        style={{ border: error ? "1px solid crimson" : "" }}
      >
        <span
          style={{ color: error ? "crimson" : "" }}
          className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </span>
        <select
          className="w-full h-full px-2.5 pt-4 pb-2.5 outline-none border-none rounded-xl"
          name={name}
          {...properties}
          disabled={disabled}
        >
          <option value="" selected disabled className="capitalize">
            {placeholder}
          </option>
          {options?.map((option) => (
            <option value={option?.value}>{option?.label}</option>
          ))}
        </select>
      </div>
      {error && (
        <small className="text-red-500 font-medium uppercase">
          {error?.message}
        </small>
      )}
    </div>
  );
};

export default DropdownField;

interface DropdownFieldProps {
  options: Option[];
  placeholder?: string;
  label?: string;
  name: string;
  properties?: any;
  error?: any;
  disabled?: boolean;
}

interface Option {
  label: string;
  value: string;
}
