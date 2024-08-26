import doctorImg from "../../../../assets/doctor.png";
import { Link } from "react-router-dom";
import { Button, DashboardSection, InputField } from "../../../../components";
import { publicRequest } from "../../../../api/requestMethods";
import { useEffect, useState } from "react";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { notifyFailure } from "../../../../utils/Utils";

const HOSPITAL_QUERY = `
query {
  hospitals {
    id,
    name,
  }
}
`;
export default function OnlineAppointment() {
  const [hospitals, setHospitals] = useState([]);
  const dispatch = useDispatch();

  const getHospitals = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: HOSPITAL_QUERY,
      });
      return response.data.data.hospitals;
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      throw error;
    }
  };
  useEffect(() => {
    dispatch(loadingStart());
    getHospitals()
      .then((data) => {
        setHospitals(data);
        dispatch(loadingEnd());
      })
      .catch((err) => {
        notifyFailure(err.toString());
      });
  }, [dispatch]);
  if (!hospitals) {
    return <div>Loading or no hospital data available...</div>;
  }
  return (
    <DashboardSection>
      <div className="flex justify-between my-4 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-semibold w-full md:w-auto">
          Get Appointment
        </h2>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button title="Recently Viewed" className="w-fit" secondary={true} />
          <Button title="Reset" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="flex gap-2 items-center my-4 flex-wrap">
        <InputField label="Location" className="flex-grow" />
        <div className="w-fit mt-2 md:mt-0">
          <Button title="Search" secondary={true} />
        </div>
      </div>
      {hospitals.map((hospital: any) => (
        <div key={hospital?.id} className="flex flex-col gap-4">
          <Link
            to={`/patient-dashboard/online-appointment/online-hospital-profile/${hospital?.id}`}
          >
            <div className="border-primary border rounded-lg p-3 cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between gap-2 my-2">
                <div className="w-full md:w-1/5 mb-4 md:mb-0">
                  <img
                    src={doctorImg}
                    alt="Doctor"
                    className="w-full h-auto p-2 rounded-full block mx-auto"
                  />
                </div>
                <div className="w-full md:w-3/5">
                  <h2 className="text-xl md:text-3xl font-medium">
                    {hospital?.name}
                  </h2>
                  <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
                  <p>Dentist</p>
                  <div className="flex flex-col gap-2 lg:flex-row justify-between">
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
                <div className="w-full md:w-1/5 flex flex-col gap-2">
                  <Button title="Video Call" secondary={true} />
                  <Link to="/patient-dashboard/find-doctor/profile/1">
                    <Button title="View Profile" secondary={true} />
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 my-2">
                <div className="border-primary border w-full md:w-1/3 p-2 rounded-lg flex flex-col gap-2">
                  <p className="text-sm">Video Consultation</p>
                  <p className="text-sm">Available today</p>
                  <p className="text-sm">Rs 2500</p>
                </div>
                <div className="border-primary border w-full md:w-2/3 p-2 rounded-lg">
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
        </div>
      ))}
    </DashboardSection>
  );
}
