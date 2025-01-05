import { Button, DashboardSection } from "../../../../../components";
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
import patientui from "../../../../../assets/drmyprofile/patientui.png";

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
      {
        title: "Completed Procedures",
        href: "/procedures",
        icon: completeprocedure,
      },
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

const FILTERS = [
  {
    heading: "Patients Filters",
    links: [
      { title: "All Patients", href: "/all-patients", icon: profile },
      { title: "Recently Visited", href: "/recently-visited", icon: profile },
      { title: "Recently Added", href: "/recently-added", icon: profile },
    ],
  },
  {
    heading: "Groups Filters",
    links: [
      { title: "Groups", href: "/groups", icon: communication },
      { title: "Memberships", href: "/memberships", icon: communication },
      { title: "All Female Patients", href: "/all-female-patients", icon: communication },
      { title: "Female Patients Over 30", href: "/female-over-30", icon: communication },
      { title: "Male Patients Over 30", href: "/male-over-30", icon: communication },
    ],
  },
];


const patients = [
  { name: 'John Doe', id: '123456' },
  { name: 'Jane Smith', id: '654321' },
  { name: 'Alice Johnson', id: '789012' },
  { name: 'Bob Brown', id: '345678' },
  { name: 'Charlie Black', id: '901234' },
  { name: 'Diana White', id: '567890' },
  { name: 'Bob Brown', id: '345678' },
  { name: 'Charlie Black', id: '901234' },
  { name: 'Diana White', id: '567890' },
];


export default function MyPatientsSection() {
  return (
    <DashboardSection>
      <div className="flex justify-between">
        {/* Left Side Content */}
        <div className="w-1/3">
          {SECTIONS.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-[#5C89D8]">
                {section.heading}
              </h2>
              <div className="flex flex-col">
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="flex items-center justify-start gap-2 py-2 px-4 border-[#5C89D8] border-b-2 border-opacity-50"
                    style={{ borderBottomWidth: '2px', borderBottomColor: '#5C89D8', width: '70%' }}
                  >
                    <img
                      src={link.icon}
                      alt="Icon"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                      style={{
                        filter:
                          "invert(36%) sepia(87%) saturate(1585%) hue-rotate(187deg) brightness(90%) contrast(91%)",
                      }}
                    />
                    <span
                      className="text-sm md:text-base truncate"
                      style={{ color: "#5C89D8" }}
 >
                      {link.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Static Right Side Content */}
        <div className="w-1/3">
          {FILTERS.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-[#5C89D8]">
                {section.heading}
              </h2>
              <div className="flex flex-col">
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="flex items-center justify-start gap-2 py-2 px-4 border-b-2 border-[#5C89D8] border-opacity-50"
                    style={{ borderBottomWidth: '2px', borderBottomColor: '#5C89D8', width: '70%', marginTop: '10px' }}
                  >
                    <img
                      src={link.icon}
                      alt="Icon"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                      style={{
                        filter:
                          "invert(36%) sepia(87%) saturate(1585%) hue-rotate(187deg) brightness(90%) contrast(91%)",
                      }}
                    />
                    <span
                      className="text-sm md:text-base truncate"
                      style={{ color: "#5C89D8" }}
                    >
                      {link.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* 3rd side */}
        <div className="w-1/3">
      {/* Buttons Section */}
      <div className="flex justify-end mb-4 gap-2">
         <Button
                  title="Search Patient"
                  className="text-xs w-30"
                />
                <Button
                  title="Add New"
                  className="text-xs w-30"
                />
                <Button
                  title="Save Vitals"
                  className="text-xs w-30"
                />
      </div>

      {/* Patients Section */}
      <div className="grid grid-cols-3 gap-">
        {patients.map((patient, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start py-1 px-2"
          >
            <img
              src={patientui}
              alt="Patient Icon"
              className="w-full object-contain" 
            />
            <span
              className="text-xs truncate mt-1"
              style={{ color: "#5C89D8" }}
            >
              {patient.name}
            </span>
            <span
              className="text-xs"
              style={{ color: "#5C89D8" }}
            >
              {patient.id}
            </span>
          </div>
        ))}
      </div>
    </div>
      </div>
    </DashboardSection>
  );
}