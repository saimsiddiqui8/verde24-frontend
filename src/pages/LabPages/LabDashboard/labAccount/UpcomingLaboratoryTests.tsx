import { DashboardSection } from "../../../../components";
import lablogo from "../../../../assets/labprofile/lablogo.png";
import testlogo from "../../../../assets/labprofile/testlogo.png";
import { Link } from "react-router-dom";
import {
  FindAppointmentByStatus,
  UpdateLabAppointmentStatus,
} from "../../../../api/apiCalls/labApi";
import {
  FIND_APPOINTMENT_BY_STATUS,
  UPDATE_LAB_APPOINTMENT_STATUS,
} from "./queries";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { RootState } from "../../../../redux/store";
import { PatientLabAppointment } from "../../../../api/apiCalls/types";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

const UpcomingLaboratoryTests = () => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const queryClient = useQueryClient();

  const FindPatientAppointment = async (status: string) => {
    if (!id) return;
    const response = await FindAppointmentByStatus(FIND_APPOINTMENT_BY_STATUS, {
      labId: id,
      status,
    });
    if (!response) {
      throw new Error("finding appointment failed!");
    }
    return response;
  };

  const { data } = useQuery({
    queryKey: ["patientappointment", id, "Pending"],
    queryFn: async () => {
      dispatch(loadingStart());
      return FindPatientAppointment("Pending");
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

  const updatelabstatus = async (AppointmentID: number) => {
    const response = await UpdateLabAppointmentStatus(
      UPDATE_LAB_APPOINTMENT_STATUS,
      { updateLabAppointmentStatusId: AppointmentID, status: "Approved" },
    );

    if (!response) {
      throw new Error("Updating lab status failed!");
    }

    return response;
  };

  const { mutate } = useMutation(updatelabstatus, {
    onMutate: () => {
      dispatch(loadingStart());
    },
    onSuccess: () => {
      dispatch(loadingEnd());
      notifySuccess("Appointment Approved!");
      queryClient.invalidateQueries(["patientappointment", id, "Pending"]);
      queryClient.invalidateQueries(["patientappointment", id, "Approved"]);
    },
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

  return (
    <DashboardSection title="Upcoming Laboratory Tests">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-3/5">
          {(data ?? [])?.length > 0 ? (
            data.map((test: PatientLabAppointment) => (
              <div
                key={test?.id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 mb-3 border border-primary rounded-lg bg-white shadow-sm"
              >
                <img
                  src={testlogo}
                  alt="profile"
                  className="rounded-full w-16 h-16"
                />
                <div className="flex-1 text-center sm:text-left sm:ml-4">
                  <Link to={`labpatientprofile/${test?.id}`}>
                    <div className="font-bold text-lg sm:text-base text-blue-600 hover:underline">
                      {test.patient_name}
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                  <div className="text-sm text-gray-600 text-primary">
                    {test?.appointment_weekday}, {test?.appointment_date},{" "}
                    {test?.appointment_time}
                  </div>
                  <div className="flex justify-center sm:justify-end items-center gap-2 mt-2">
                    <Link to={`labpatientprofile/${test?.id}`}>
                      <button className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-4 py-2 rounded-lg">
                        Open
                      </button>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        mutate(test?.id);
                      }}
                      className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-4 py-2 rounded-lg"
                    >
                      Confirm
                    </button>
                    <div className="flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full">
                      {test?.labTests?.length ?? []}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-primary font-semibold mt-9 text-lg sm:text-2xl">
              No Upcoming Laboratory Tests Found
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/5 flex justify-center mt-6 lg:mt-0">
          <img
            src={lablogo}
            alt="Lab logo"
            className="rounded-lg w-32 h-32 sm:w-36 sm:h-36"
          />
        </div>
      </div>
      <Toaster />
    </DashboardSection>
  );
};

export default UpcomingLaboratoryTests;
