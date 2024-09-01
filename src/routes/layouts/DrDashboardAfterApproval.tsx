import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import doctorImg from "../../assets/doctor.png";
import Profile from "../../assets/sidemenu/doctor/profile.png";
import calendar from "../../assets/sidemenu/doctor/calendar.png";
import appointments from "../../assets/sidemenu/doctor/appointments.png";
import mypatients from "../../assets/sidemenu/doctor/mypatients.png";
import paymentandpayouts from "../../assets/sidemenu/doctor/paymentandpayouts.png";
import reports from "../../assets/sidemenu/doctor/reports.png";
import activities from "../../assets/sidemenu/doctor/activities.png";
import feedback from "../../assets/sidemenu/doctor/feedback.png";
import dashboard from "../../assets/sidemenu/doctor/dashboard.png";

const links = [
  { title: "My Profile", href: "/profile", icon: Profile },
  { title: "Calendar", href: "/calendar", icon: calendar },
  { title: "Appointments", href: "/appointments", icon: appointments },
  { title: "My Patients", href: "/mypatients", icon: mypatients },
  { title: "Schedule Slot", href: "/schedule", icon: calendar },
  {
    title: "Payment & Payouts",
    href: "/payment&payouts",
    icon: paymentandpayouts,
  },
  { title: "Reports", href: "/reports", icon: reports },
  { title: "Activities", href: "/activities", icon: activities },
  { title: "Feed Back", href: "/feedback", icon: feedback },
  { title: "Communications", href: "/communications", icon: dashboard },
];

const BASE_URL = "/doctor-dashboard";

export default function DrDashboardAfterApproval() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const handleToggle = (linkTitle: string) => {
    setCollapsed(linkTitle === "My Patients");
  };

  return (
    <main className="grid grid-cols-12 gap-4 md:gap-8 my-8 mx-4 md:mx-8 text-primary transition-all duration-500">
      <section
        className={`transition-all duration-500 ${collapsed ? "col-span-2" : "col-span-3"} pt-10 pb-5 h-fit border border-primary rounded-md`}
      >
        <div className="py-1 px-4">
          <img
            src={doctorImg}
            alt="Doctor"
            className="w-24 h-24 md:w-36 md:h-36 rounded-full block mx-auto"
          />
          <p className="text-[#5C89D8] text-sm text-center font-semibold my-1">
            Doctor Name
          </p>
        </div>
        <div className="mt-5 flex flex-col items-center w-full">
          {links.map((link, index) => {
            const isActive = pathname === BASE_URL + link?.href;
            const activeColor = "#3FB946";
            const iconFilter = isActive
              ? `invert(36%) sepia(76%) saturate(680%) hue-rotate(78deg) brightness(94%) contrast(95%)`
              : "invert(36%) sepia(87%) saturate(1585%) hue-rotate(187deg) brightness(90%) contrast(91%)";

            return (
              <Link
                key={index}
                to={BASE_URL + link?.href}
                className={`flex items-center justify-start gap-2 py-1 px-4 ${collapsed ? "w-12" : "w-full"} border-b-2 border-grey-400 transition-all duration-500`}
                onClick={() => handleToggle(link.title.trim())}
              >
                <img
                  src={link?.icon}
                  alt="Icon"
                  className="w-5 h-5 md:w-6 md:h-6 object-contain"
                  style={{ filter: iconFilter }}
                />
                {!collapsed && (
                  <span
                    className={`truncate text-sm md:text-base ${isActive ? `text-[${activeColor}]` : "text-[#5C89D8]"} transition-all duration-500`}
                    style={{ minWidth: "0" }}
                  >
                    {link?.title}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>
      <section
        className={`transition-all duration-500 ${collapsed ? "col-span-10" : "col-span-9"} min-w-0`}
      >
        <Outlet />
      </section>
    </main>
  );
}
