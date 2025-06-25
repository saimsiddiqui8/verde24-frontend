import { DashboardSection } from "../../../../../components";
import profile from "../../../../../assets/drmyprofile/profile.png";
import communication from "../../../../../assets/drmyprofile/communication.png";
import vitals from "../../../../../assets/drmyprofile/vitals.png";
import clinic from "../../../../../assets/drmyprofile/clinic.png";
import files from "../../../../../assets/drmyprofile/files.png";
import prescription from "../../../../../assets/drmyprofile/prescription.png";
import invoices from "../../../../../assets/drmyprofile/invoices.png";
import payments from "../../../../../assets/drmyprofile/payments.png";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

const SECTIONS = [
  {
    heading: "Patient",
    links: [
      { title: "Profile", href: "", icon: profile },
      { title: "Appointments", href: "/appointments", icon: profile },
      { title: "Communication", href: "/communication", icon: communication },
    ],
  },
  {
    heading: "EMR",
    links: [
      { title: "Vital Signs", href: "/vitalsigns", icon: vitals },
      { title: "Clinical Notes", href: "/clinicalnotes", icon: clinic },
      // { title: "Treatment Plans", href: "/treatmentplans", icon: treatment },
      // {
      //   title: "Completed Procedures",
      //   href: "/procedures",
      //   icon: completeprocedure,
      // },
      { title: "Files", href: "/files", icon: files },
      { title: "Prescriptions", href: "/prescriptions", icon: prescription },
    ],
  },
  {
    heading: "Billing",
    links: [
      { title: "Invoices", href: "/invoices", icon: invoices },
      { title: "Payments", href: "/payments", icon: payments },
    ],
  },
];

const BASE_URL = "/doctor-dashboard/my-patient";
export default function SinglePatientProfile() {
  const { pathname } = useLocation();
  const { id } = useParams();

  return (
    <DashboardSection>
      <div className="flex justify-between">
        {/* Left Side Content */}
        <div className="w-3/12">
          {SECTIONS.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-[#5C89D8]">
                {section.heading}
              </h2>
              <div className="flex flex-col">
                {section.links.map((link, linkIndex) => {
                  const isActive = pathname === `${BASE_URL}/${id}${link.href}`;
                  return (
                    <Link
                      key={linkIndex}
                      to={`${BASE_URL}/${id}${link.href}`}
                      className={`flex items-center justify-start gap-2 py-2 px-4 border-b-2 border-[#5C89D8] border-opacity-50 w-[70%] transition-colors duration-200 
            }`}
                    >
                      <img
                        src={link.icon}
                        alt="Icon"
                        className="w-4 h-4 md:w-5 md:h-5 object-contain"
                        style={{
                          filter: isActive
                            ? "invert(36%) sepia(76%) saturate(680%) hue-rotate(78deg) brightness(94%) contrast(95%)"
                            : "invert(36%) sepia(87%) saturate(1585%) hue-rotate(187deg) brightness(90%) contrast(91%)",
                        }}
                      />
                      <span
                        className="text-sm md:text-base truncate"
                        style={{
                          color: isActive ? "#3FB946" : "#5C89D8",
                        }}
                      >
                        {link.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="w-9/12">
          <Outlet />
        </div>
      </div>
    </DashboardSection>
  );
}
