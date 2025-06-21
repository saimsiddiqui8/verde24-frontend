import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { findAppointmentByDoctor } from "../../../../../api/apiCalls/doctorsApi";
import { GET_APPOINTMENT_BY_DOCTOR_ID } from "../consultationForm/queries";
import { loadingEnd, loadingStart } from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import { RootState } from "../../../../../redux/store";
import { Link } from "react-router-dom";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";
import patientui from "../../../../../assets/drmyprofile/patientui.png";
interface Appointment {
  patient_id: number;
  patient: {
    first_name: string;
    last_name: string;
    image: string;
    age: number;
    gender: string;
  };
}

const BASE_URL = "/doctor-dashboard/my-patient";

const RecentlyVisited = () => {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();

  const getDoctorAppointments = async () => {
    const response = await findAppointmentByDoctor(GET_APPOINTMENT_BY_DOCTOR_ID, {
      findAppointmentByDoctorId: id,
    });
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

  const recentIds: number[] = JSON.parse(localStorage.getItem("recentPatients") || "[]");

  const uniquePatientsMap = new Map();
  (data ?? []).forEach((appointment: Appointment) => {
    if (!uniquePatientsMap.has(appointment.patient_id)) {
      uniquePatientsMap.set(appointment.patient_id, appointment);
    }
  });

  const uniquePatients: Appointment[] = Array.from(uniquePatientsMap.values());

  const recentPatients = recentIds
    .map((id) => uniquePatients.find((p) => p.patient_id === id))
    .filter(Boolean) as Appointment[];

  return (
   <div>
  <h2 className="text-xl font-semibold mb-4">Recently Visited Patients</h2>

  {recentPatients.length === 0 ? (
    <div className="text-center text-primary font-semibold text-lg">
      No recent visits found.
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recentPatients.map((data) => (
        <Link
          key={data.patient_id}
          to={`${BASE_URL}/${data.patient_id}`}
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
              {data.patient.first_name + " " + data.patient.last_name}
            </span>
            <span className="text-xs text-[#5C89D8]">{`PAT-${String(data.patient_id).padStart(3, "0")}`}</span>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

  );
};

export default RecentlyVisited;
