import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";

export default function ConfirmBooking() {
  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Confirm Booking</h2>
      </div>
      <div className="flex flex-col gap-0 sm:flex-row items-center sm:gap-2">
        <DropdownField
          options={[
            { label: "City 1", value: "city1" },
            { label: "City 2", value: "city2" },
          ]}
          name="city"
          placeholder="Search For City"
          className="w-full sm:w-1/3"
        />
        <InputField
          placeholder="Search for Tests and Packages"
          className="w-full"
        />
        <Button title="Search" className="w-full sm:w-fit" secondary />
      </div>
    </DashboardSection>
  );
}
