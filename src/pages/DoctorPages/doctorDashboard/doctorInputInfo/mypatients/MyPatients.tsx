import { DashboardSection } from "../../../../../components";
import profile from "../../../../../assets/drmyprofile/profile.png";
import communication from "../../../../../assets/drmyprofile/communication.png";
import vitals from "../../../../../assets/drmyprofile/vitals.png";
import clinic from "../../../../../assets/drmyprofile/clinic.png";
import treatment from "../../../../../assets/drmyprofile/treatment.png";
import completeprocedure from "../../../../../assets/drmyprofile/completeprocedure.png";
import files from "../../../../../assets/drmyprofile/files.png";
import prescription from "../../../../../assets/drmyprofile/prescription.png";
import invoices from "../../../../../assets/drmyprofile/invoices.png";
import payments from "../../../../../assets/drmyprofile/payments.png";
const SECTIONS = [
  {
    heading: "Patient",
    links: [
      { title: "Profile", href: "/profile", icon: profile },
      { title: "Appointments", href: "/appointments", icon: profile },
      { title: "Communication", href: "/communication", icon: communication },
    ],
  },
  {
    heading: "EMR",
    links: [
      { title: "Vital Signs", href: "/vitalsigns", icon: vitals },
      { title: "Clinical Notes", href: "/clinicalnotes", icon: clinic },
      { title: "Treatment Plans", href: "/treatmentplans", icon: treatment },
      { title: "Completed Procedures", href: "/procedures", icon: completeprocedure },
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

export default function MyPatientsSection() {
  return (
    <DashboardSection>
      {SECTIONS.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg sm:text-3xl font-semibold mb-3 text-[#5C89D8]">
            {section.heading}
          </h2>
          <div className="flex flex-col">
            {section.links.map((link, linkIndex) => (
              <a
                key={linkIndex}
                href={link.href}
                className="flex items-center justify-start gap-2 py-2 px-4 border-b-2 border-green-400"
              >
                <img
                  src={link.icon}
                  alt="Icon"
                  className="w-5 h-5 md:w-6 md:h-6 object-contain"
                  style={{
                    filter:
                      "invert(36%) sepia(87%) saturate(1585%) hue-rotate(187deg) brightness(90%) contrast(91%)",
                  }}
                />
                <span className="text-sm md:text-base truncate" style={{ color: "#5C89D8" }}>
                  {link.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </DashboardSection>
  );
}
