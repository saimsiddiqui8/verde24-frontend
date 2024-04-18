import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";

export default function CompletedProcedures() {
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Completed Procedure</h2>
        <div className="flex gap-2">
          <Button title="Email" className="w-fit" secondary={true} />
          <Button title="Print" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <InputField placeholder="Search by Disease" />
        <DropdownField
          options={[]}
          name="doctors"
          placeholder="Search by doctors"
        />
        <Button title="Search" className="w-fit" secondary />
      </div>
    </DashboardSection>
  );
}
