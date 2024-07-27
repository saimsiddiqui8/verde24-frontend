const Field = ({
  name,
  options,
  placeholder = "Select an option",
  label,
  properties,
  error,
  // className,
  disabled = false,
}: FieldProps) => {
  return (
    <div className="my-6">
      <label
        className={`block text-sm font-medium ${
          error ? 'text-crimson' : 'text-primary'
        }`}
      >
        {label}
        <select
          className={`w-full mt-1 px-3 py-2 bg-white shadow-sm border ${
            error ? 'border-crimson' : 'border-primary'
          } rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
          name={name}
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
      </label>
      {error && (
        <small className="text-crimson font-medium uppercase">
          {error.message}
        </small>
      )}
    </div>
  );
};

export default Field;

interface ErrorType {
  message?: string;
  code?: string;
  details?: string;
}


interface FieldProps {
  options: Option[];
  placeholder?: string;
  label?: string;
  name: string;
  properties?: React.SelectHTMLAttributes<HTMLSelectElement> | object;
  className?:string;
  error?: ErrorType | undefined;
  disabled?: boolean;
}

interface Option {
  label: string;
  value: string;
}
