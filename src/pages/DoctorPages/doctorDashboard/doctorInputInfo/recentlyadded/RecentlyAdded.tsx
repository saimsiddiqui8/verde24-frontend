import { Link } from "react-router-dom";
import patientui from "../../../../../assets/drmyprofile/patientui.png";
import { RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { SyntheticEvent, useState } from "react";
import { findAppointmentByDoctor } from "../../../../../api/apiCalls/doctorsApi";
import { GET_APPOINTMENT_BY_DOCTOR_ID } from "../consultationForm/queries";
import { useQuery } from "react-query";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { InputField } from "../../../../../components";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";

interface Appointment {
  appointment_date: string;
  patient_id: number;
  patient: {
    first_name: string;
    last_name: string;
    image: string | null;
  };
}
const BASE_URL = "/doctor-dashboard/my-patient";
const RecentlyAdded = () => {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

  const getDoctorAppointments = async () => {
    const response = await findAppointmentByDoctor(
      GET_APPOINTMENT_BY_DOCTOR_ID,
      {
        findAppointmentByDoctorId: id,
      },
    );
    return response;
  };

  const { data } = useQuery({
    queryKey: ["finddoctorappointment", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getDoctorAppointments();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (err: Error) => {
      dispatch(loadingEnd());
      notifyFailure(err.message);
    },
  });

  const uniquePatientsMap = new Map();
  (data ?? []).forEach((appointment: Appointment) => {
    if (!uniquePatientsMap.has(appointment.patient_id)) {
      uniquePatientsMap.set(appointment.patient_id, appointment);
    }
  });
  const uniquePatients: Appointment[] = Array.from(uniquePatientsMap.values());

  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const today = new Date();
  const recentlyVisitedPatients = uniquePatients.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const diff = Math.abs(today.getTime() - appointmentDate.getTime());
    return diff <= oneWeekInMs;
  });

  const filteredPatients = recentlyVisitedPatients.filter((appointment) => {
    const fullName =
      `${appointment.patient.first_name} ${appointment.patient.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <>
      <div className="flex items-center justify-start gap-3 mb-4 flex-nowrap">
        <InputField
          label=""
          className="w-52"
          name="search"
          placeholder="Search Patient"
          type="text"
          value={search}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!uniquePatients?.length ? (
          <div className="text-center text-lg font-bold text-primary">
            No patients available
          </div>
        ) : filteredPatients.length === 0 && search ? (
          <div className="text-center text-lg font-bold text-primary">
            No patient found for "{search}"
          </div>
        ) : (
          filteredPatients.map((data) => (
            <Link
              key={data.patient_id}
              to={`${BASE_URL}/${data.patient_id}`}
              onClick={() => {
                const id = data?.patient_id;
                const existing = localStorage.getItem("recentPatients");
                let recentPatients = existing ? JSON.parse(existing) : [];
                recentPatients = recentPatients.filter(
                  (pid: number) => pid !== id,
                );
                recentPatients.unshift(id);
                localStorage.setItem(
                  "recentPatients",
                  JSON.stringify(recentPatients.slice(0, 10)),
                );
              }}
              className="flex justify-center"
            >
              <div className="flex flex-col items-center py-3 px-2 cursor-pointer w-full max-w-[140px]">
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  {data?.patient?.image ? (
                    data.patient.image.includes("googleusercontent.com") ? (
                      <img
                        src={data.patient.image}
                        alt="Patient"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = patientui;
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageUrl
                        fileKey={data.patient.image}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )
                  ) : (
                    <img
                      src={patientui}
                      alt="Patient Icon"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <span className="text-xs truncate mt-2 text-[#5C89D8] text-center w-full">
                  {`${data.patient.first_name} ${data.patient.last_name}`}
                </span>
                <span className="text-xs text-[#5C89D8]">{`PAT-${String(
                  data.patient_id,
                ).padStart(3, "0")}`}</span>
              </div>
            </Link>
          ))
        )}
        <Toaster />
      </div>
    </>
  );
};

export default RecentlyAdded;
