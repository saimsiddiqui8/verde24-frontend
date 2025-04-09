import { useState } from "react";
import { Button, DashboardSection } from "../../../../components";
import { Typography } from "@material-tailwind/react";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FindLabAppointmentByPatientId } from "../../../../api/apiCalls/patientsApi";
import { FIND_LAB_APPOINTMENT_BY_PATIENT_ID } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { useQuery } from "react-query";
import { notifyFailure } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

const TABLE_HEAD = [
  "Lab Name",
  "Consultation Mode",
  "Appointment No",
  "Appointment Date & Time",
  "Status",
  "Action",
];

interface LabAppointment {
  id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_weekday: string;
  status: string;
  Lab: {
    lab_name: string;
  };
}

export default function TreatmentLabs() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const getLabAppoitment = async () => {
    if (!id) return;

    const response = await FindLabAppointmentByPatientId(
      FIND_LAB_APPOINTMENT_BY_PATIENT_ID,
      { findLabAppointmentByPatientIdId: id },
    );

    if (!response) {
      throw new Error("Failed to fetch Lab Appointment!");
    }

    return response;
  };

  const { data } = useQuery({
    queryKey: ["findlabappointment", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getLabAppoitment();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (err: Error) => {
      dispatch(loadingEnd());
      notifyFailure(err.message);
    },
  });

  const filteredAppointments = data?.filter((patient: LabAppointment) => {
    const fullName = `${patient?.Lab?.lab_name}`.toLowerCase();
    return fullName.includes(searchQuery?.toLowerCase());
  });

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Treatment Labs</h2>
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
              {TABLE_HEAD?.map((head) => (
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
            {(filteredAppointments ?? [])?.length > 0 ? (
              filteredAppointments?.map((appointmentData: LabAppointment) => (
                <tr key={id} className="odd:bg-[#5C89D826]">
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {`${appointmentData?.Lab?.lab_name}`}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      Physical Consultation
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {appointmentData?.id}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {`${appointmentData?.appointment_date} ${appointmentData?.appointment_time}`}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Button
                      className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                      title={`${appointmentData?.status}`}
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
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="text-center p-4 text-gray-500 text-primary text-2xl"
                >
                  {searchQuery
                    ? `No appointments found for "${searchQuery}"`
                    : "No appointments found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Toaster />
    </DashboardSection>
  );
}
