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

interface InputProps {
  label: string;
  properties: any;
  error: any;
}
