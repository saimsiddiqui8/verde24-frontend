import { Link, Outlet, useLocation } from "react-router-dom";
import doctorImg from "../../assets/nigeria_patient.jpeg";
import ProfileIcon from "../../assets/sidemenu/patient/Profile.svg";
import FindDoctorIcon from "../../assets/sidemenu/patient/FindDoctor.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getPatientById } from "../../api/apiCalls/patientsApi";
import { FIND_PATIENT_QUERY } from "../../pages/PatientPages/patientDashboard/patientProfile/queries";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../redux/slices/loadingSlice";
import ImageUrl from "../../components/Icons/Sidemenu/ImageUrl";
const links = [
  { title: "Profile", href: "/", icon: ProfileIcon },
  { title: "Notification", href: "/notification", icon: ProfileIcon },
  { title: "Find Doctor", href: "/find-doctor", icon: FindDoctorIcon },
 { title: "Consultation Doctors", href: "/consultation-doctors" },
{ title: "Consultation Labs", href: "/consultation-labs" },
  { title: "Transaction History", href: "/transaction-history" },
  { title: "Completed Procedures", href: "/completed-procedures" },
  { title: "Files", href: "/files" },
  { title: "Prescriptions", href: "/prescriptions" },
  { title: "Hospital Appointment", href: "/hospital-appointment" },
  { title: "Book Lab Test", href: "/book-lab-test" },
  { title: "Wallet", href: "/wallet" },
];

const BASE_URL = "/patient-dashboard";

export default function PatientLayout() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();

  const getPatient = async () => {
    if (!id) return;
    return getPatientById(FIND_PATIENT_QUERY, { id: id });
  };

  const patientData = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPatient();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  const { pathname } = useLocation();
  return (
    <main className="grid grid-cols-1 md:grid-cols-12 my-8 mx-4 md:mx-8 text-primary gap-4 md:gap-8">
      <section className="col-span-1 md:col-span-4 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        <div className="relative py-1 px-4 mt-3">
          {patientData?.data?.image ? (
            <ImageUrl fileKey={patientData?.data?.image} />
          ) : (
            <img
              src={doctorImg}
              alt="Doctor"
              className="w-24 md:w-36 h-24 md:h-36 rounded-full block mx-auto my-2"
            />
          )}
          <p className="text-[#5C89D8] text-sm text-center font-semibold my-4">
            {`${patientData?.data?.first_name} ${patientData?.data?.last_name}`}
          </p>
        </div>

        <div className="mt-5">
          {links.map((link, index) => (
            <Link
              key={index}
              to={BASE_URL + link?.href}
              className={`block py-0.5 px-4 md:px-8 border-y border-[#125DB94D] ${
                pathname === BASE_URL + link?.href && "text-[#3FB946]"
              }`}
            >
              {link?.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="col-span-1 md:col-span-8">
        <Outlet />
      </section>
    </main>
  );
}
