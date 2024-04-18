import { Link, Outlet } from "react-router-dom";
import doctorImg from "../../assets/doctor.png";
import ProfileIcon from "../../assets/sidemenu/patient/Profile.svg";
import FindDoctorIcon from "../../assets/sidemenu/patient/FindDoctor.svg";
// import TreatmentPlanIcon from "../../assets/sidemenu/patient/TreatmentPlan.svg";
// import CompletedProceduresIcon from "../../assets/sidemenu/patient/CompletedProcedures.svg";
// import FilesIcon from "../../assets/sidemenu/patient/Files.svg";
// import PrescriptionsIcon from "../../assets/sidemenu/patient/Prescriptions.svg";
// import OnlineAppointmentIcon from "../../assets/sidemenu/patient/OnlineAppointment.svg";

const links = [
  { title: "Profile", href: "/", icon: ProfileIcon },
  { title: "Find Doctor", href: "/find-doctor", icon: FindDoctorIcon },
  { title: "Treatment Plans", href: "/treatment-plans" },
  { title: "Completed Procedures", href: "/completed-procedures" },
  { title: "Files", href: "/files" },
  { title: "Prescriptions", href: "/prescriptions" },
  { title: "Online Appointment", href: "/online-appointment" },
];

const BASE_URL = "/patient-dashboard";

export default function PatientLayout() {
  return (
    <main className="grid grid-cols-12 my-8 mx-8 text-primary gap-8">
      <section className="col-span-4 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        <div className="py-1 px-4">
          <img
            src={doctorImg}
            alt="Doctor"
            className="w-36 h-36 rounded-full block mx-auto"
          />
        </div>
        <div className="mt-5">
          {links.map((link) => (
            <Link
              to={BASE_URL + link?.href}
              className="flex py-0.5 px-8 border-y border-[#125DB94D]"
            >
              {/* <img className="fill-blue-500" src={link?.icon} /> */}
              {link?.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="col-span-8">
        <Outlet />
      </section>
    </main>
  );
}
