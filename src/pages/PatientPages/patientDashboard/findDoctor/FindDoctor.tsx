import { Button, DashboardSection, InputField } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Link } from "react-router-dom";

const doctors = [1, 2, 3, 4, 5, 6];

export default function FindDoctor() {
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Find Doctor</h2>
        <div className="flex gap-2">
          <Button title="Recently Viewed" className="w-fit" secondary={true} />
          <Button title="Reset" className="w-fit" secondary={true} />
          <Button title="Find Near Me" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="flex gap-2 items-center my-4">
        <InputField label="Location" />
        <div className="w-fit">
          <Button title="Search" secondary={true} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {doctors?.map((doctor) => (
          <Link to={`/patient-dashboard/find-doctor/appointment/${doctor}`}>
            <div className="border-primary border rounded-lg p-3 cursor-pointer">
              <div className="flex justify-between gap-2 my-2">
                <div className="w-1/5">
                  <img
                    src={doctorImg}
                    alt="Doctor"
                    className="w-full h-auto p-2 rounded-full block mx-auto"
                  />
                </div>
                <div className="w-3/5">
                  <h2 className="text-3xl font-medium">
                    Dr Muhammad Sohaib Ahmed
                  </h2>
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
                  <Link to={`/patient-dashboard/find-doctor/profile/${doctor}`}>
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
                    Smile Solutions | Dental Clinic | Orthodontic & Implant
                    Centre, Model Town, Lahore
                  </h5>
                  <p className="text-sm">Available today</p>
                  <p className="text-sm">Rs 1000</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardSection>
  );
}
