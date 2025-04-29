import { DashboardSection } from "../../../../components";
import lablogo from "../../../../assets/labprofile/lablogo.png";
import testlogo from "../../../../assets/labprofile/testlogo.png";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { FindAppointmentByStatus } from "../../../../api/apiCalls/labApi";
import { FIND_APPOINTMENT_BY_STATUS } from "./queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { PatientLabAppointment } from "../../../../api/apiCalls/types";
import { notifyFailure } from "../../../../utils/Utils";

const LabBookedAppointments = () => {
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const FindPatientAppointment = async (status: string) => {
    if (!id) {
      return;
    }

    const response = await FindAppointmentByStatus(FIND_APPOINTMENT_BY_STATUS, {
      labId: id,
      status,
    });

    if (!response) {
      throw new Error("Finding appointment failed!");
    }

    return response;
  };

  const { data } = useQuery({
    queryKey: ["patientappointment", id, "Approved"],
    queryFn: async () => {
      dispatch(loadingStart());
      return FindPatientAppointment("Approved");
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

  return (
    <DashboardSection title="Booked Laboratory Tests">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-3/5">
          {(data ?? [])?.length > 0 ? (
            data.map((test: PatientLabAppointment) => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 mb-3 border border-primary rounded-lg bg-white shadow-sm"
              >
                <img
                  src={testlogo}
                  alt="profile"
                  className="rounded-full w-16 h-16"
                />
                <div className="flex-1 text-center sm:text-left sm:ml-4">
                  <div className="font-bold text-lg sm:text-base">
                    {test?.patient_name}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                  <div className="text-sm text-gray-600 text-primary">
                    {" "}
                    {test?.appointment_weekday}, {test?.appointment_date} ,{" "}
                    {test?.appointment_time}
                  </div>
                  <div className="flex justify-center sm:justify-end items-center gap-2 mt-2">
                    <button className="font-bold text-xs bg-primary border border-primary text-white px-6 py-2 rounded-lg">
                      Booked
                    </button>
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

        <div className="w-full lg:w-1/5 flex justify-center lg:justify-end">
          <img
            src={lablogo}
            alt="Lab logo"
            className="rounded-lg w-32 h-32 sm:w-36 sm:h-36"
          />
        </div>
      </div>
    </DashboardSection>
  );
};

export default LabBookedAppointments;
