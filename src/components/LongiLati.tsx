export default function LongiLati({
  label,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  properties,
  error,
  disabled,
  className,
}: NumberInputProps) {
  return (
    <div className={`relative ${className ?? "my-6"}`}>
      <input
        id={name}
        type="number"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange || (() => {})}
        onKeyDown={onKeyDown}
        disabled={disabled}
        {...properties}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer ${error ? "border-crimson" : ""}`}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] whitespace-nowrap bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        style={{ color: error ? "crimson" : "" }}
      >
        {label}
      </label>
      {error && (
        <small className="text-red-500 font-medium uppercase">
          {error.message}
        </small>
      )}
    </div>
  );
}

interface NumberInputProps {
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  properties?: any;
  error?: any;
  disabled?: boolean;
  className?: string;
}
