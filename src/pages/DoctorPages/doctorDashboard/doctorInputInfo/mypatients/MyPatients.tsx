import { DashboardSection } from "../../../../../components";
import profile from "../../../../../assets/drmyprofile/profile.png";
import communication from "../../../../../assets/drmyprofile/communication.png";
import { Link, Outlet, useLocation } from "react-router-dom";

const FILTERS = [
  {
    heading: "Patients Filters",
    links: [
      { title: "All Patients", href: "/", icon: profile },
      { title: "Recently Visited", href: "/recently-visited", icon: profile },
      { title: "Recently Added", href: "/recently-added", icon: profile },
    ],
  },
  {
    heading: "Groups Filters",
    links: [
      { title: "Groups", href: "/groups", icon: communication },
      { title: "Memberships", href: "/memberships", icon: communication },
      {
        title: "Female Patients Over 30",
        href: "/female-over-30",
        icon: communication,
      },
      {
        title: "Male Patients Over 30",
        href: "/male-over-30",
        icon: communication,
      },
    ],
  },
];

const BASE_URL = "/doctor-dashboard/my-patient";

export default function MyPatientsSection() {
  const { pathname } = useLocation();

  return (
    <DashboardSection>
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-5/12">
          {FILTERS.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-[#5C89D8]">
                {section.heading}
              </h2>
              <div className="flex flex-col">
                {section.links.map((link, linkIndex) => {
                  const isActive = pathname === `${BASE_URL}${link.href}`;
                  return (
                    <Link
                      key={linkIndex}
                      to={`${BASE_URL}${link.href}`}
                      className="flex items-center justify-start gap-2 py-2 px-4 border-b-2 border-[#5C89D8] border-opacity-50 mt-2 w-full sm:w-[70%]"
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
                        style={{ color: isActive ? "#3FB946" : "#5C89D8" }}
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

        <div className="w-full lg:w-5/12">
          <Outlet />
        </div>
      </div>
    </DashboardSection>
  );
}
