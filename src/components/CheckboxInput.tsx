export default function CheckboxInput({
  label,
  name,
  options,
  onChange,
}: CheckboxInputProps) {
  return (
    <div className="my-3.5">
      {label ? (
        <label className="text-xs text-primary duration-300 bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
          {label}
        </label>
      ) : (
        ""
      )}
      <div className=" mt-2">
        {options?.map((option, i) => (
          <div className="flex items-center my-2">
            <input
              type="checkbox"
              value={option.value}
              checked={option?.checked}
              name={name}
              id={name + i}
              onChange={onChange}
              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={name + i}
              className="ms-2 text-xs font-medium text-primary"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

type Option = {
  label: string;
  value: string;
  checked?: boolean;
};

type CheckboxInputProps = {
  label?: string;
  name: string;
  options: Option[] | undefined;
  onChange: (e: any) => void;
};
