export default function TextareaField({
  label,
  placeholder,
  name,
  properties,
  rows,
}: TextareaFieldProps) {
  return (
    <div className="relative">
      <textarea
        rows={rows}
        placeholder={placeholder}
        name={name}
        {...properties}
        className="block my-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-primary placeholder:text-blue-600 appearance-none focus:outline-none peer"
      ></textarea>
      <label className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
        {label}
      </label>
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  onChange?: (e: React.SyntheticEvent) => void;
  rows: number;
  properties?: any;
}
