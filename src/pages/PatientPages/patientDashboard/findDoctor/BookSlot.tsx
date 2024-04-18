import { Link, useLocation, useParams } from "react-router-dom";
import { Button, DashboardSection } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { FaCircle } from "react-icons/fa";

export default function BookSlot() {
  const { id } = useParams();
  const { state } = useLocation();

  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Get Appointment Online</h2>
        <div className="flex gap-2">
          <Button title="Recently Viewed" className="w-fit" secondary={true} />
          <Button title="Cancel" className="w-fit" secondary={true} />
          <Button title="Save Slot" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="border-primary border rounded-lg p-3">
        <div className="flex justify-between gap-2 my-2">
          <div className="w-1/5">
            <img
              src={doctorImg}
              alt="Doctor"
              className="w-full h-auto p-2 rounded-full block mx-auto"
            />
          </div>
          <div className="w-3/5">
            <h2 className="text-3xl font-medium">Dr Muhammad Sohaib Ahmed</h2>
            <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
            <p>Dentist</p>
            <div className="flex justify-between">
              <div>
                <p>Reviews</p>
                <p>195</p>
              </div>
              <div>
                <p>Experience</p>
                <p>10 years</p>
              </div>
              <div>
                <p>Satisfaction</p>
                <p>100%</p>
              </div>
            </div>
          </div>
          <div className="w-1/5 flex flex-col gap-2">
            <Button title="Book Clinic Visit" secondary={true} />
            <Button title="Video Call" secondary={true} />
            <Link to={`/patient-dashboard/find-doctor/profile/${id}`}>
              <Button title="View Profile" secondary={true} />
            </Link>
          </div>
        </div>
        <div className="flex justify-between gap-4 my-2">
          <div className="border-primary border w-1/3 p-2 rounded-lg flex flex-col gap-2">
            <p className="text-sm">Video Consultation</p>
            <p className="text-sm">Available today</p>
            <p className="text-sm">Rs 2500</p>
          </div>
          <div className="border-primary border w-2/3 p-2 rounded-lg">
            <h5 className="text-base">
              Smile Solutions | Dental Clinic | Orthodontic & Implant Centre,
              Model Town, Lahore
            </h5>
            <p className="text-sm">Available today</p>
            <p className="text-sm">Rs 1000</p>
          </div>
        </div>
      </div>
      <div className="border-primary border p-5 rounded-lg my-2">
        <h3 className="text-2xl font-bold">{state?.consultation}</h3>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Rs. 2,500</p>
          <p className="text-sm">Available from Feb 19 - 03:00 PM - 05:00 PM</p>
          <p className="flex gap-2 items-center">
            <FaCircle fill="#3FB946" />
            Online
          </p>
        </div>
      </div>
      <div className="border-primary border p-5 rounded-lg my-2">
        <h3 className="text-2xl font-bold">Selected Slots</h3>
      </div>
      <div className="border-primary border p-5 rounded-lg my-2">
        <h3 className="text-2xl font-bold">Select Payment Method</h3>
      </div>
    </DashboardSection>
  );
}
