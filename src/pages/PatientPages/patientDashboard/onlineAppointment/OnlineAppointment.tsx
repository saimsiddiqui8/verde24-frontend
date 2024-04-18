import { Button, DashboardSection } from "../../../../components";

export default function OnlineAppointment() {
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Get Appointment</h2>
        <div className="flex gap-2">
          <Button title="Recently Viewed" className="w-fit" secondary={true} />
          <Button title="Reset" className="w-fit" secondary={true} />
          <Button title="Find Near Me" className="w-fit" secondary={true} />
        </div>
      </div>
    </DashboardSection>
  );
}
