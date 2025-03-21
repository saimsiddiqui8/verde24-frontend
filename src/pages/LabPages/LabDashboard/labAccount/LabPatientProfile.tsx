import { Button, DashboardSection } from "../../../../components";
import testlogo from "../../../../assets/labprofile/testlogo.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FindAppointmentById, UpdateLabAppointmentStatus } from "../../../../api/apiCalls/labApi";
import { FIND_APPOINTMENT_BY_ID, UPDATE_LAB_APPOINTMENT_STATUS } from "./queries";
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { notifySuccess } from "../../../../utils/Utils";
import { RootState } from "../../../../redux/store";
import { Toaster } from "react-hot-toast";




const LabPatientProfile = () => {
    const {id}  = useParams();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const idredux = useSelector((state: RootState) => state.user.currentUser?.id);
    const navigate = useNavigate();
 
 const FindAppointment = async () => {
   if (!id) return ;
   return FindAppointmentById(FIND_APPOINTMENT_BY_ID, { findLabAppointmentByIdId: Number(id) });
 };
 
 const { data } = useQuery({
   queryKey: ["patientappointmentbyid", id,],
    queryFn: async () => {
               dispatch(loadingStart()); 
               return FindAppointment();
             },
   onSuccess: () => dispatch(loadingEnd()), 
 });
 
 const updatelabstatus = (AppointmentID:number,status: string)=>{
    return UpdateLabAppointmentStatus(UPDATE_LAB_APPOINTMENT_STATUS,{updateLabAppointmentStatusId:AppointmentID,status:status})
  }
  
  const { mutate } = useMutation({
    mutationFn: ({ AppointmentID, status }: { AppointmentID: number; status: string }) => 
      updatelabstatus(AppointmentID, status),
       onMutate: () => {
          dispatch(loadingStart()); 
        },
    onSuccess: () => {
      dispatch(loadingEnd());
      notifySuccess("Appointment Status Updated!");
      queryClient.invalidateQueries(["patientappointment", idredux, "Pending"]);
      queryClient.invalidateQueries(["patientappointment", idredux, "Approved"]);
      queryClient.invalidateQueries(["patientappointment", idredux, "Cancelled"]);
      navigate(-1);
    },
  });
  
  return (
    <DashboardSection title="View Test Details">
      <div className="flex flex-wrap justify-between">
        <div className="w-full lg:w-3/5">
  <div className="w-3/4 flex items-center justify-between p-3 mb-2 border border-gray-300 rounded-lg bg-white mt-4">
    <img
      src={testlogo}
      alt="profile"
      className="rounded-full w-12 h-12"
    />
    <div className="flex-1 ml-4">
      <div className="font-bold">{data?.patient_name}</div>
      <div>{data?.labTest?.title}</div>
    </div>
    <div className="flex flex-col items-end">
      <div className="mr-3 my-1 text-sm text-gray-600 text-primary">
        {data?.appointment_weekday}, {data?.appointment_date}
      </div>
      <div className="flex justify-center items-center gap-1">
        <div className="flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full">
          1
        </div>
      </div>
    </div>
  </div>

  <div className="w-3/4 p-3 border border-gray-300 rounded-lg bg-white-50 mt-1 text-sm">
    <div><strong>Name:</strong> {data?.patient_name}</div>
    <div><strong>Email:</strong> {data?.patient_email}</div>
    <div><strong>Phone:</strong> {data?.patient_phone_number}</div>
    <div><strong>Age:</strong> {data?.patient_age}</div>
    <div><strong>Gender:</strong> {data?.patient_gender}</div>
    <div><strong>Status:</strong> {data?.status}</div>
  </div>
</div>


        <div className="w-full lg:w-2/5 bg-white p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-0 " >
          <h3 className="text-2xl font-bold text-[#3FB946] mb-4">Your Cart &nbsp; <span className="text-lg text-[#3FB946]"> 1 Test</span></h3>
          <div className="pb-2 mb-2">
            <div className="flex justify-between border-y border-y-gray-500 py-2.5">
              <span>{data?.labTest?.title}</span>
              <span className="">${data?.labTest?.price}</span>
            </div>
            
            <p className="text-primary text-gray-600 mt-4">Preparation</p>
            <p className="text-primary text-gray-600 leading-5">{data?.labTest?.description}</p>
          </div>
          <div className="flex justify-evenly w-64 py-2 m-auto mt-5 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
            <span className="text-[#3FB946]">Total</span>
            <span className="text-[#3FB946]">${data?.labTest?.price}</span>
          </div>
          <div className="flex justify-end mt-4 gap-4">
            <Button onClick={() => mutate({ AppointmentID: Number(id), status: "Cancelled" })}  title="Cancel" className=" rounded-lg"/>
              
            <Button  onClick={() => mutate({ AppointmentID: Number(id), status: "Approved" })} title="Confirm Now" className="rounded-lg"/>
              
          </div>
        </div>
      </div>
      <Toaster/>
    </DashboardSection>
  );
};

export default LabPatientProfile;
