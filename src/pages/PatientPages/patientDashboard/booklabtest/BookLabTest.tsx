import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { GET_NEAREST_LABS } from "../patientProfile/queries";
import { findNearestLabs } from "../../../../api/apiCalls/patientsApi";
import { useQuery } from "react-query";
import { RiMapPinLine, RiTimerLine } from "react-icons/ri"; 
export default function BookLabTest() {
    const latitude = useSelector((state: RootState) => state.user.currentUser?.latitude);
    const longitude = useSelector((state: RootState) => state.user.currentUser?.longitude);
    console.log(latitude , longitude);
      const getNearestLab = async () => {
        if(!latitude || !longitude)return;
        return findNearestLabs(GET_NEAREST_LABS, { latitude:latitude,longitude:longitude,radiusInKm:10 });
      };

       const {data} = useQuery({
          queryKey: ["nearestlab"],
          queryFn: getNearestLab,
        });

        console.log("ddddddd" , data);
        
    
  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Select A City</h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <DropdownField
          options={[
            { label: "City 1", value: "city1" },
            { label: "City 2", value: "city2" }
          ]}
          name="city"
          placeholder="Search For City"
          className="w-full sm:w-1/3"
        />
        <InputField
          placeholder="Search for Tests and Packages"
          className="w-full sm:flex-1"
        />
        <Button title="Search" className="w-full sm:w-auto" secondary />
      </div>

<div className="border-primary border rounded-lg p-3 cursor-pointer mt-4">
  <div className="flex flex-col sm:flex-row items-center gap-4 my-2">
    <div className="w-32 sm:w-1/5 relative flex-shrink-0">
      <img
        src={doctorImg}
        alt="Doctor"
        className="w-full h-auto p-2 rounded-full mx-auto"
      />
    </div>
    <div className="flex-1 text-center sm:text-left">
      <h2 className="text-xl sm:text-3xl font-medium">Simba Lab | Pathology Services</h2>
      <div className="flex justify-center sm:justify-between gap-10 mt-2">
        <div>
          <p className="text-sm sm:text-base">Reviews</p>
          <p className="font-medium">195</p>
        </div>
        <div>
          <p className="text-sm sm:text-base">Satisfaction</p>
          <p className="font-medium">100%</p>
        </div>
        <div className="flex flex-col items-center">
        <p className="text-sm sm:text-base">Distance</p>
        <div className="flex items-center gap-1">
    <RiMapPinLine size={20} className="text-primary" />
    <p className="font-medium">5 km</p>
  </div>
        </div>
        <div className="flex flex-col items-center">
        <p className="text-sm sm:text-base">Duration</p>
        <div className="flex items-center gap-1">
          <RiTimerLine size={20} className="text-primary" />
          <p className="font-medium">30 min</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="flex flex-col sm:flex-row justify-between gap-4 my-2">
    <div className="border-primary border w-full sm:w-2/3 p-2 rounded-lg">
      <h5 className="text-base text-center sm:text-left">
        Smile Solutions | Dental Clinic | Orthodontic & Implant Centre, Model Town, Lahore
      </h5>
    </div>
    <div className="w-full sm:w-1/3 p-2 rounded-lg flex flex-col gap-2 justify-center items-center">
      <Button className="w-36" title="Book Test" secondary />
      <Link to={`/patient-dashboard/find-doctor/profile/hey`}>
        <Button className="w-36" title="View Profile" secondary />
      </Link>
    </div>
  </div>
</div>

    </DashboardSection>
  );
}
