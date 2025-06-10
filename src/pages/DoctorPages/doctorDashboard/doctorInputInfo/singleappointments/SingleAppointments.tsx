import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { findAppointmentByPatient } from "../../../../../api/apiCalls/patientsApi";
import { GET_APPOINTMENT_BY_PATIENT_ID } from "../../../../PatientPages/patientDashboard/patientProfile/queries";
import { loadingEnd, loadingStart } from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import { RootState } from "../../../../../redux/store";
import { useMemo } from "react";

const SingleAppointments = () => {
     const {id} = useParams();
     const doctorId = useSelector((state: RootState) => state.user.currentUser?.id);
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
  return data?.filter((item: any) => item.doctor_id === doctorId) || [];
}, [data, doctorId]);

       console.log("dataaaaaa" , data);
       
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#5C89D8]">Appointments</h2>

      {filteredAppointments.length === 0 ? (
        <p className="text-gray-500">No appointments found for this doctor.</p>
      ) : (
        filteredAppointments.map((item:any, index:number) => (
          <div key={index} className="border p-4 rounded-md shadow-sm bg-white">
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">Date:</span>
              <span>{item.appointment_date}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">Time:</span>
              <span>{item.appointment_time}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">Doctor:</span>
              <span>{item.doctor?.first_name} {item.doctor?.last_name}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">Duration:</span>
              <span>{item.duration} min</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">Status:</span>
              <span>{item.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default SingleAppointments