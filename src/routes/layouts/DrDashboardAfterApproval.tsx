import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
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
  { title: "Payment & Payouts", href: "/payment&payouts", icon: paymentandpayouts },
  { title: "Reports", href: "/reports", icon: reports },
  { title: "Activities", href: "/activities", icon: activities },
  { title: "Feed Back", href: "/feedback", icon: feedback },
  { title: "Communications", href: "/communications", icon: dashboard },
];

const BASE_URL = "/doctor-dashboard";

export default function DrDashboardAfterApproval() {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = (linkTitle:string) => {
    if (linkTitle === "My Patients") {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 my-8 mx-4 md:mx-8 text-primary">
      <section
        className={`${
          collapsed ? "md:col-span-2" : "md:col-span-4"
        } col-span-1 pt-10 pb-5 h-fit border border-primary rounded-md transition-all duration-300`}
        style={{ width: collapsed ? "90%" : "100%" }}
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
          {links.map((link, index) => (
            <Link
              key={index}
              to={BASE_URL + link?.href}
              className={`flex items-center justify-start gap-2 py-1 px-4 ${
                collapsed ? "w-12" : "w-80"
              } border-b-2 border-green-400 transition-all duration-300`}
              onClick={() => handleToggle(link.title.trim())}
            >
              <img
                src={link?.icon}
                alt="Icon"
                className="w-5 h-5 md:w-6 md:h-6 object-contain"
                style={{
                  filter:
                    "invert(36%) sepia(87%) saturate(1585%) hue-rotate(187deg) brightness(90%) contrast(91%)",
                }}
              />
              {!collapsed && (
                <span
                  className="truncate text-sm md:text-base"
                  style={{ minWidth: "0", color: "#5C89D8" }}
                >
                  {link?.title}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
      <section className={`md:col-span-${collapsed? "10":"8"} col-span-1 transition-all duration-500`}>
        <Outlet />
      </section>
    </main>
  );
}
