import { Link, Outlet } from "react-router-dom";
import doctorImg from "../../assets/doctor.png";
// import DashboardIcon from "../../assets/sidemenu/doctor/Dashboard.svg";
import ProfileIcon from "../../assets/sidemenu/doctor/My Profile.svg";
// import AppointmentsIcon from "../../assets/sidemenu/doctor/Appointments.svg";
// import PatientsIcon from "../../assets/sidemenu/doctor/My Patients.svg";
// import ScheduleIcon from "../../assets/sidemenu/doctor/Schedule Slots.svg";
// import PaymentIcon from "../../assets/sidemenu/doctor/Payment & Payouts.svg";

const links = [
  // { title: "Dashboard", href: "/", icon: DashboardIcon },
  { title: "My Profile", href: "/profile", icon: ProfileIcon },
  // { title: "Appointments", href: "/appointments", icon: AppointmentsIcon },
  // { title: "My Patients", href: "/my-patients", icon: PatientsIcon },
  // { title: "Schedule Slots", href: "/schedule-slots", icon: ScheduleIcon },
  // {
  //   title: "Payment & Payouts",
  //   href: "/payment-and-payouts",
  //   icon: PaymentIcon,
  // },
];

const BASE_URL = "/doctor-dashboard";

export default function DoctorLayout() {
  return (
    <main className="grid grid-cols-12 my-8 mx-8 text-primary gap-8">
      <section className="col-span-4 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        <div className="bg-[#FFF500] text-[#125DB9] font-bold px-2 py-1 absolute top-2 right-4 rounded">
          Pending Verification
        </div>
        <div className="py-1 px-4">
          <img
            src={doctorImg}
            alt="Doctor"
            className="w-36 h-36 rounded-full block mx-auto"
          />
          <p className="text-[#5C89D8] text-sm text-center font-semibold my-1">
            Doctor Name
          </p>
          <button className="block mx-auto my-3 py-0.5 px-2 text-base text-[#E02020] border-2 border-[#E02020]">
            Stop Accepting Appointments
          </button>
          <button className="block mx-auto my-3 py-0.5 px-2 text-base text-[#3FB946] border-2 border-[#3FB946]">
            Share My Booking Page
          </button>
        </div>
        <div className="mt-5 flex flex-col items-center w-full">
          {links.map((link) => (
            <Link
              to={BASE_URL + link?.href}
              className="flex items-center gap-2 py-0.5 px-8"
            >
              <img src={link?.icon} alt="Icon" className="w-6" />
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

// border-y border-[#125DB94D]
