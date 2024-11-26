import { useEffect, useState } from "react";
import { Button, DashboardSection } from "../../../../components";
import { Typography } from "@material-tailwind/react";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { findAppointmentByPatient } from "../../../../api/apiCalls/patientsApi";
import { notifyFailure } from "../../../../utils/Utils";
import { GET_APPOINTMENT_BY_PATIENT_ID } from "../patientProfile/queries";

const TABLE_HEAD = [
  "Doctor Name",
  "Consultation Mode",
  "Appointment No",
  "Appointment Date & Time",
  "Status",
  "Action",
];

type Meeting = {
  id?: number;
  startTime?: string;
  googleMeetUrl?: string;
  appointmentsId?: number;
};

type Appointment = {
  id: number;
  appointment_date: string;
  appointment_time: string;
  patient_id: number;
  doctor_id: number;
  duration: number;
  payment_id: number;
  status: string;
  meeting: Meeting;
  doctor: {
    first_name: string;
    last_name: string;
  };
};

export default function TreatmentPlans() {
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>(
    [],
  );
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAppointments = patientAppointments.filter(({ doctor }) => {
    const fullName = `${doctor?.first_name} ${doctor?.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getPatientAppointments = async () => {
    dispatch(loadingStart());
    try {
      const response = await findAppointmentByPatient(
        GET_APPOINTMENT_BY_PATIENT_ID,
        {
          findAppointmentByPatientId: id,
        },
      );

      setPatientAppointments(response);
      dispatch(loadingEnd());
    } catch (err: any) {
      dispatch(loadingEnd());
      notifyFailure(err.toString());
    }
  };

  useEffect(() => {
    getPatientAppointments();
  }, []);
  patientAppointments.map((data) => {
    console.log("appoint", data?.meeting);
  });

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Treatment Plans</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by doctors"
          className="sm:w-2/6 block px-2.5 pb-2.5 pt-4 w-full text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="bg-white p-2 sm:p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(
                ({
                  appointment_date,
                  appointment_time,
                  payment_id,
                  status,
                  id,
                  meeting,
                  doctor,
                }) => (
                  <tr key={id} className="odd:bg-[#5C89D826]">
                    <td className="p-2 sm:p-4">
                      <Typography variant="small" className="font-normal">
                        {`${doctor?.first_name} ${doctor?.last_name}`}
                      </Typography>
                    </td>
                    <td className="p-2 sm:p-4">
                      <Typography variant="small" className="font-normal">
                        Video Consultation
                      </Typography>
                    </td>
                    <td className="p-2 sm:p-4">
                      <Typography variant="small" className="font-normal">
                        {payment_id}
                      </Typography>
                    </td>
                    <td className="p-2 sm:p-4">
                      <Typography variant="small" className="font-normal">
                        {`${appointment_date} ${appointment_time}`}
                      </Typography>
                    </td>
                    <td className="p-2 sm:p-4">
                      <Button
                        className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                        title={`${status}`}
                        disabled
                      />
                    </td>
                    <td className="p-2 sm:p-4">
                      <Button
                        className="font-bold text-xs bg-[#3FB946] bg-none text-white rounded-[7px] px-8"
                        title="Paid"
                        disabled
                      />
                    </td>
                    {meeting?.googleMeetUrl && status === "Approved" && (
                      <td className="p-2 sm:p-4">
                        <Button
                          className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                          title="Join Meeting"
                          onClick={() => window.open(meeting.googleMeetUrl)}
                        />
                      </td>
                    )}
                  </tr>
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="text-center p-4 text-gray-500"
                >
                  No appointments found for "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
