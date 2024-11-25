import { Typography } from "@material-tailwind/react";
import { Button, DashboardSection } from "../../../../../components";
import { RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  APPROVED_APPOINTMENT,
  CANCEL_APPOINTMENT,
  CREATE_MEETING_LINK,
  GET_APPOINTMENT_BY_DOCTOR_ID,
  START_GOOGLE_AUTH,
} from "../consultationForm/queries";
import {
  cancelAppointment,
  createMeeting,
  findAppointmentByDoctor,
  startGoogleAuth,
  updateAppointmentStatus,
} from "../../../../../api/apiCalls/doctorsApi";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TABLE_HEAD = [
  "Patient Name",
  "Consultation Mode",
  "Appointment No",
  "Appointment Date & Time",
  "Status",
  "Action",
];

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
  meeting: Meeting;
  patient: {
    first_name: string;
    last_name: string;
  };
}

export default function Appointments() {
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>(
    [],
  );
  const [authResponse, setAuthResponse] = useState<string | null>(null);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const location = useLocation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 40 * 60 * 1000);
  const formattedDate = currentDate.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const access = urlParams.get("access_token");
    const refresh = urlParams.get("refresh_token");

    setAccessToken(access);
    setRefreshToken(refresh);
  }, [location]);

  const getDoctorAppointments = async () => {
    dispatch(loadingStart());
    try {
      const response = await findAppointmentByDoctor(
        GET_APPOINTMENT_BY_DOCTOR_ID,
        {
          findAppointmentByDoctorId: id,
        },
      );
      setDoctorAppointments(response);
      dispatch(loadingEnd());
    } catch (err: any) {
      notifyFailure(err.toString());
    }
  };

  const getAuth = async () => {
    try {
      const response = await startGoogleAuth(START_GOOGLE_AUTH);
      if (response) {
        setAuthResponse(response);
      }
    } catch (error) {
      console.error("Error getting startGoogleAuth:", error);
      throw error;
    }
  };
  useEffect(() => {
    getDoctorAppointments();
    getAuth();
  }, []);

  const handleCreateMeeting = async (iD: number) => {
    const meetingData = {
      appointment_id: iD,
      code: null,
      eventDetails: {
        startTime: currentDate.toISOString(),
        endTime: futureDate.toISOString(),
      },
      userTokens: {
        access_token: accessToken ?? "",
        refresh_token: refreshToken ?? "",
      },
    };
    dispatch(loadingStart());
    try {
      await createMeeting(CREATE_MEETING_LINK, meetingData);
      dispatch(loadingEnd());
      getDoctorAppointments();
    } catch (error) {
      console.error("Error in handleCreateMeeting:", error);
    }
  };

  const handleRedirect = () => {
    const authUrl = authResponse;
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const handleApproved = async (idApproved: number, status: string) => {
    const appointmentData = {
      id: idApproved,
      status: status,
      timeSlotStatus: status === "Approved" ? "Booked" : "Available",
    };
    dispatch(loadingStart());
    try {
      await updateAppointmentStatus(APPROVED_APPOINTMENT, appointmentData);
      dispatch(loadingEnd());
      getDoctorAppointments();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };

  const handleCancel = async (
    amount: number,
    appointmentId: number,
    patientId: number,
  ) => {
    const appointmentData = {
      appointment_id: appointmentId,
      patient_id: patientId,
      amount: amount,
    };
    dispatch(loadingStart());
    try {
      await cancelAppointment(CANCEL_APPOINTMENT, appointmentData);
      dispatch(loadingEnd());
      getDoctorAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };
  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Appointments</h2>
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
            {doctorAppointments?.map(
              ({
                id,
                patient_id,
                appointment_date,
                appointment_time,
                payment_id,
                status,
                meeting,
                patient,
              }) => (
                <tr key={id} className="odd:bg-[#5C89D826]">
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {`${patient?.first_name} ${patient?.last_name}`}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      Video consultation
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
                  {status === "Pending" && (
                    <td className="p-2 sm:p-4">
                      <Button
                        className="font-bold text-xs rounded-md"
                        title="Approved"
                        onClick={() => handleApproved(id, "Approved")}
                      />
                    </td>
                  )}
                  {status === "Pending" && (
                    <td className="p-2 sm:p-4">
                      <Button
                        className="font-bold text-xs rounded-md"
                        title="Cancel"
                        onClick={() => handleCancel(100, id, patient_id)}
                      />
                    </td>
                  )}
                  {status === "Approved" &&
                    appointment_date === formattedDate &&
                    !accessToken &&
                    !refreshToken &&
                    !meeting?.googleMeetUrl && (
                      <td className="p-2 sm:p-4">
                        <Button
                          className="font-bold text-xs rounded-md"
                          title="Create meet token"
                          onClick={() => handleRedirect()}
                        />
                      </td>
                    )}
                  {status === "Approved" &&
                    appointment_date === formattedDate &&
                    accessToken &&
                    refreshToken &&
                    !meeting?.googleMeetUrl && (
                      <td className="p-2 sm:p-4">
                        <Button
                          className="font-bold text-xs rounded-md"
                          title="Create meeting"
                          onClick={() => handleCreateMeeting(id)}
                        />
                      </td>
                    )}

                  {meeting?.googleMeetUrl && status === "Approved" && (
                    <td className="p-2 sm:p-4">
                      <Button
                        className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                        title={"join meeeting"}
                        disabled
                        onClick={() => window.open(meeting.googleMeetUrl)}
                      />
                    </td>
                  )}
                  {meeting?.googleMeetUrl && status === "Approved" && (
                    <td className="p-2 sm:p-4">
                      <Button
                        className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                        title={"status Completed"}
                        disabled
                        onClick={() => handleApproved(id, "Completed")}
                      />
                    </td>
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
