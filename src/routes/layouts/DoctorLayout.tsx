import { Link, Outlet } from "react-router-dom";
import doctorImg from "../../assets/doctor.png";
import ProfileIcon from "../../assets/sidemenu/doctor/My Profile.svg";

const links = [
  { title: "My Profile", href: "/profile", icon: ProfileIcon },
  { title: "Schedule Slot", href: "/schedule", icon: ProfileIcon },
];

const BASE_URL = "/doctor-dashboard";

export default function DoctorLayout() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 my-8 mx-4 md:mx-8 text-primary">
      <section className="md:col-span-4 col-span-1 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        <div className="bg-[#FFF500] text-[#125DB9] font-bold px-2 py-1 absolute top-2 right-4 rounded">
          Pending Verification
        </div>
        <div className="py-1 px-4">
          <img
            src={doctorImg}
            alt="Doctor"
            className="w-24 h-24 md:w-36 md:h-36 rounded-full block mx-auto"
          />
          <p className="text-[#5C89D8] text-sm text-center font-semibold my-1">
            Doctor Name
          </p>
          <button className="block mx-auto my-3 py-1 px-4 text-sm md:text-base text-[#E02020] border-2 border-[#E02020] rounded">
            Stop Accepting Appointments
          </button>
          <button className="block mx-auto my-3 py-1 px-4 text-sm md:text-base text-[#3FB946] border-2 border-[#3FB946] rounded">
            Share My Booking Page
          </button>
        </div>
        <div className="mt-5 flex flex-col items-center w-full">
          {links.map((link, index) => (
            <Link 
              key={index}
              to={BASE_URL + link?.href}
              className="flex items-center justify-center gap-2 py-1 px-4 w-full"
            >
              <img 
                src={link?.icon} 
                alt="Icon" 
                className="w-5 h-5 md:w-6 md:h-6 object-contain"
              />
              <span 
                className="truncate text-sm md:text-base text-center"
                style={{ minWidth: '0' }}
              >
                {link?.title}
              </span>
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
