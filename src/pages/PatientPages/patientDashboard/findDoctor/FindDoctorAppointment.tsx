import { Button, DashboardSection, InputField } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Link, useParams } from "react-router-dom";
import { getDoctorById } from "../../../../api/apiCalls/doctorsApi";
import { useEffect, useState } from "react";
import { Doctor } from "../../../../api/apiCalls/types";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { GET_DOCTOR_QUERY } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { notifyFailure } from "../../../../utils/Utils";

export default function FindDoctorAppointment() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : null;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) {
      dispatch(loadingStart());
      return;
    }

    const fetchDoctor = async () => {
      dispatch(loadingStart());
      try {
        const doctorData = await getDoctorById(GET_DOCTOR_QUERY, {
          findDoctorByIdId: numericId,
        });
        setDoctor(doctorData);
        dispatch(loadingEnd());
      } catch (err: any) {
        notifyFailure(err.toString());
      }
    };

    fetchDoctor();
  }, [id, dispatch]);

  return (
    <DashboardSection>
      <div className="flex justify-between my-4 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-semibold w-full md:w-auto">
          Get Appointment
        </h2>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button title="Recently Viewed" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="flex gap-2 items-center my-4 flex-wrap">
        <InputField placeholder="Location" />
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <Button title="Search" secondary={true} />
        </div>
      </div>
      <Link to={`/patient-dashboard/find-doctor/select-slot/${id}`}>
        {doctor && (
          <div className="flex flex-col gap-4">
            <div className="border-primary border rounded-lg p-3">
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
                    {doctor.first_name} {doctor.last_name}
                  </h2>
                  <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
                  <p>Dentist</p>
                  <div className="flex flex-col md:flex-row justify-between gap-2">
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
                <div className="w-full md:w-1/5 flex justify-center md:justify-end items-end mb-3">
                  <Link to={`/patient-dashboard/find-doctor/profile/${id}`}>
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
                </div>
              </div>
            </div>
          </div>
        )}
      </Link>
    </DashboardSection>
  );
}
