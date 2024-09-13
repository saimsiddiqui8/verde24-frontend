import { Link, Outlet } from "react-router-dom";
import doctorImg from "../../assets/doctor.png";
import ProfileIcon from "../../assets/sidemenu/doctor/My Profile.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getDoctorById } from "../../api/apiCalls/doctorsApi";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../redux/slices/loadingSlice";

const links = [{ title: "My Profile", href: "/", icon: ProfileIcon }];

const BASE_URL = "/doctor-dashboard";

const GET_DOCTOR_QUERY = `
query FindDoctorById($findDoctorByIdId: Int!) {
  findDoctorById(id: $findDoctorByIdId) {
    id
    first_name
    last_name
    email
    image
    is_verified
    form_submitted
  }
}
`;

export default function DoctorLayout() {
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
    <main className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 my-8 mx-4 md:mx-8 text-primary">
      <section className="md:col-span-4 col-span-1 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        {doctorData?.data && (
          <div>
            <div className="bg-[#FFF500] text-[#125DB9] font-bold px-2 py-1 absolute top-2 right-4 rounded">
              {doctorData?.data?.form_submitted ? ("YOUR APPROVAL IS PENDING") : ("PLEASE SUBMIT THE FORM")}
            </div>
            <div className="py-1 px-4 my-5">
              <img
                src={doctorData?.data?.image || doctorImg}
                alt="Doctor"
                className="w-36 h-36 rounded-full block mx-auto"
              />
              <p className="text-[#5C89D8] text-sm text-center font-semibold my-4">
                {`${doctorData?.data?.first_name} ${doctorData?.data?.last_name}`}
              </p>
            </div>
          </div>
        )}


        <div className="mt-5 flex flex-col items-center w-full">
          {links.map((link, index) => (
            <Link
              key={index}
              to={BASE_URL + link?.href}
              className="flex items-center gap-2 py-0.5 px-8"
            >
              <img src={link?.icon} alt="Icon" className="w-6" />
              {link?.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="md:col-span-8 col-span-1">
        <Outlet />
      </section>
    </main>
  );
}
