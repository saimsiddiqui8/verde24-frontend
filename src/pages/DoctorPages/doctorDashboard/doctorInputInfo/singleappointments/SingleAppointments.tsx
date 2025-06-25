import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { findAppointmentByPatient } from "../../../../../api/apiCalls/patientsApi";
import { GET_APPOINTMENT_BY_PATIENT_ID } from "../../../../PatientPages/patientDashboard/patientProfile/queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import { RootState } from "../../../../../redux/store";
import { useMemo } from "react";
import { DashboardSection } from "../../../../../components";

interface Meeting {
  id: number;
  startTime: string;
  googleMeetUrl: string;
  appointmentsId: number;
}

interface Appointment {
  appointment_date: string;
  appointment_time: string;
  doctor_id: number;
  duration: number;
  id: number;
  patient_id: number;
  payment_id: number;
  status: string;
  meeting?: Meeting;
  patient: {
    first_name: string;
    last_name: string;
  };
}

const SingleAppointments = () => {
  const { id } = useParams();
  const doctorId = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const dispatch = useDispatch();
  const getPatientAppointments = async () => {
    const response = await findAppointmentByPatient(
      GET_APPOINTMENT_BY_PATIENT_ID,
      { findAppointmentByPatientId: Number(id) },
    );
    if (!response) {
      throw new Error("Failed to fetch Patient Appointment!");
    }

    return response;
  };

  const { data } = useQuery({
    queryKey: ["findpatientappointment", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPatientAppointments();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (err: Error) => {
      dispatch(loadingEnd());
      notifyFailure(err.message);
    },
  });

  const filteredAppointments = useMemo(() => {
    return (
      data?.filter((item: Appointment) => item.doctor_id === doctorId) || []
    );
  }, [data, doctorId]);

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
          Appointments
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="bg-white p-2 sm:p-4 text-sm font-medium text-primary">
                Patient Name
              </th>
              <th className="bg-white p-2 sm:p-4 text-sm font-medium text-primary">
                Appointment No
              </th>
              <th className="bg-white p-2 sm:p-4 text-sm font-medium text-primary">
                Appointment Date & Time
              </th>
              <th className="bg-white p-2 sm:p-4 text-sm font-medium text-primary">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-primary">
                  No appointments found for this patient.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((item: Appointment, index: number) => (
                <tr key={index} className="odd:bg-[#5C89D826]">
                  <td className="p-2 sm:p-4 text-sm text-primary">
                    {item.patient?.first_name} {item.patient?.last_name}
                  </td>
                  <td className="p-2 sm:p-4 text-sm text-primary text-center">
                    {item.id}
                  </td>
                  <td className="p-2 sm:p-4 text-sm text-primary">
                    {item.appointment_date} {item.appointment_time}
                  </td>
                  <td className="p-2 sm:p-4">
                    <span className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-4 py-1 rounded-[15px] inline-block">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
};

export default SingleAppointments;
