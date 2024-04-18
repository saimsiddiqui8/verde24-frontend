import { useQuery } from "react-query";
import AddSlots from "./doctorInputInfo/addSlots/AddSlots";
import ConsultationForm from "./doctorInputInfo/consultationForm/ConsultationForm";
import { getDoctorById } from "../../../api/apiCalls/doctorsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";

const GET_DOCTOR_QUERY = `
query($id:String!) {
  findDoctorById(id: $id) {
    id
    first_name
    last_name
    email
    phone_number
    gender
    is_verified
    consultation_mode
    timeSlots {
      id
    }
  }
}
`;

export default function DoctorDashboard() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();

  const getDoctor = () => {
    return getDoctorById(GET_DOCTOR_QUERY, { id });
  };

  const doctorData = useQuery({
    queryKey: ["Doctors", id, "profile"],
    queryFn: getDoctor,
  });

  if (doctorData?.isLoading) {
    dispatch(loadingStart());
    return null;
  } else {
    dispatch(loadingEnd());
  }

  return (
    <>
      {doctorData?.data?.isVerified ? (
        <div></div>
      ) : doctorData?.data?.timeSlots?.length > 0 ? (
        <div>Your Profile is pending verification!</div>
      ) : doctorData?.data?.consultation_mode ? (
        <AddSlots />
      ) : (
        <ConsultationForm />
      )}
    </>
  );
}
