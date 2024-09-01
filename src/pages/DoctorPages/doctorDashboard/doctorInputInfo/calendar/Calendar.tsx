import { Button } from "../../../../../components";

export default function Calendar() {
  return (
    <main className="w-full h-full relative text-primary border border-primary rounded-md">
      <div className="absolute top-8 right-4 flex gap-4">
        <Button
          title="Print Lab"
          className="px-4 py-2 text-sm whitespace-nowrap"
        />
        <Button
          title="Add New"
          className="px-4 py-2 text-sm whitespace-nowrap"
        />
        <Button
          title="Save Vitals"
          className="px-4 py-2 text-sm whitespace-nowrap"
        />
      </div>
    </main>
  );
}
