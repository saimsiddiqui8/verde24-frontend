import { DashboardSection } from "../../../../components";
import lablogo from '../../../../assets/labprofile/lablogo.png';
import testlogo from '../../../../assets/labprofile/testlogo.png';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { FindAppointmentByStatus } from "../../../../api/apiCalls/labApi";
import { FIND_APPOINTMENT_BY_STATUS } from "./queries";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { PatientAppointmentlab } from "../../../../api/apiCalls/types";

const DeclinedAppointments = () => {
       const dispatch = useDispatch();
       const id = useSelector((state: RootState) => state.user.currentUser?.id);
    
       const FindPatientAppointment = async (status : string ) => {
        if (!id) return ;
        return FindAppointmentByStatus(FIND_APPOINTMENT_BY_STATUS, { labId: id, status });
      };
      
        const { data } = useQuery({
          queryKey: ["patientappointment", id, "Cancelled"],
          queryFn: async () => {
            dispatch(loadingStart()); 
            return FindPatientAppointment("Cancelled");
          },
          onSuccess: () => dispatch(loadingEnd()), 
        });
        

  return (
    <DashboardSection title="Upcoming Laboratory Tests">
  <div className="flex flex-col lg:flex-row justify-between">
    <div className="w-full lg:w-3/5">
      {data?.length > 0 ? (
        data.map((test: PatientAppointmentlab) => (
          <div
            key={test?.id}
            className="flex flex-col sm:flex-row items-center justify-between p-4 mb-3 border border-primary rounded-lg bg-white"
          >
            <div className="flex items-center w-full sm:w-auto">
              <img
                src={testlogo}
                alt="profile"
                className="rounded-full w-14 h-14"
              />
              <div className="ml-4">
                <div className="font-bold text-lg">{test?.patient_name}</div>
                <div className="text-sm text-primary">{test?.labTest?.title}</div>
              </div>
            </div>
            <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
              <div className="text-sm text-primary">
                {test?.appointment_weekday}, {test?.appointment_date}
              </div>
              <button className="mt-2 font-bold text-xs bg-red-500 border border-red-500 text-white px-6 py-2 rounded-lg">
                Canceled
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-primary font-semibold mt-9 text-2xl">
          No Canceled Laboratory Tests
        </div>
      )}
    </div>
    <div className="w-full lg:w-1/5 flex justify-center mt-6 lg:mt-0">
      <img src={lablogo} alt="Lab logo" className="rounded-lg w-36 h-36" />
    </div>
  </div>
</DashboardSection>

  );
};

export default DeclinedAppointments