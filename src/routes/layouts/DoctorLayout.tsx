import { Outlet } from "react-router-dom";
import doctorImg from "../../assets/doctor.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getDoctorById } from "../../api/apiCalls/doctorsApi";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../redux/slices/loadingSlice";
import { GET_DOCTOR_QUERY } from "../../pages/DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import ImageUrl from "../../components/Icons/Sidemenu/ImageUrl";

export default function DoctorLayout() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();

  const getDoctor = async () => {
    if (!id) return;
    return await getDoctorById(GET_DOCTOR_QUERY, {
      findDoctorByIdId: id,
    });
  };

  const {data} = useQuery({
    queryKey: ["Doctors", id],
    queryFn: getDoctor,
  });

  if (data?.isLoading) {
    dispatch(loadingStart());
    return null;
  } else {
    dispatch(loadingEnd());
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 my-8 mx-4 md:mx-8 text-primary">
      <section className="md:col-span-3 col-span-1 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        {data && (
          <div>
            <div className="bg-[#FFF500] text-[#125DB9] font-bold px-2 py-1 absolute top-2 right-4 rounded">
              {data?.form_submitted
                ? "YOUR APPROVAL IS PENDING"
                : "PLEASE SUBMIT THE FORM"}
            </div>
            <div className="py-1 px-4 my-5">
              {data?.image ? 
              <ImageUrl fileKey={data?.image}/>:  <img
                src={doctorImg}
                alt="Doctor"
                className="w-36 h-36 rounded-full block mx-auto"
              />}
            
              <p className="text-[#5C89D8] text-sm text-center font-semibold my-4">
                {`${data?.first_name} ${data?.last_name}`}
              </p>
            </div>
          </div>
        )}
      </section>
      <section className="md:col-span-9 col-span-1">
        <Outlet />
      </section>
    </main>
  );
}
