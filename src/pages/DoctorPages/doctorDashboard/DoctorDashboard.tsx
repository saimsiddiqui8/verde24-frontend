import { useQuery } from "react-query";
import { getDoctorById } from "../../../api/apiCalls/doctorsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import DoctorLayout from "../../../routes/layouts/DoctorLayout";

const GET_DOCTOR_QUERY = `
query FindDoctorById($findDoctorByIdId: Int!) {
  findDoctorById(id: $findDoctorByIdId) {
    id
    email
    is_verified
    form_submitted
  }
}
`;

export default function DoctorDashboard() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const getDoctor = async () => {
    if(!id) return ;
    return await getDoctorById(GET_DOCTOR_QUERY, {
      findDoctorByIdId: id,
    });
  };

  const doctorData = useQuery({
    queryKey: ["Doctors", id],
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
      <DoctorLayout />
    </>
  );
}
