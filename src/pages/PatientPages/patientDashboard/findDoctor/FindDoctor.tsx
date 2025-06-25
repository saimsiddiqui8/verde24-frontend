import { Button, DashboardSection } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { notifyFailure } from "../../../../utils/Utils";
import { BASE_URL } from "../../../../BaseUrl";
import { getVerifiedDoctors } from "../../../../api/apiCalls/patientsApi";
import { UpdateDoctorData } from "../../../../api/apiCalls/types";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";

const specializationOptions = [
  { label: "Internal Medicine", value: "Internal Medicine" },
  { label: "General Surgery", value: "General Surgery" },
  { label: "Pediatrics", value: "Pediatrics" },
  {
    label: "Obstetrics and Gynecology (OB/GYN)",
    value: "Obstetrics and Gynecology (OB/GYN)",
  },
  {
    label: "Family Medicine / General Practice",
    value: "Family Medicine / General Practice",
  },
  { label: "Psychiatry", value: "Psychiatry" },
  { label: "Anesthesiology", value: "Anesthesiology" },
  { label: "Emergency Medicine", value: "Emergency Medicine" },
  { label: "Radiology", value: "Radiology" },
  { label: "Pathology", value: "Pathology" },
  { label: "General Psychiatry", value: "General Psychiatry" },
  {
    label: "Child and Adolescent Psychiatry",
    value: "Child and Adolescent Psychiatry",
  },
  { label: "Addiction Psychiatry", value: "Addiction Psychiatry" },
  { label: "Geriatric Psychiatry", value: "Geriatric Psychiatry" },
  { label: "Forensic Psychiatry", value: "Forensic Psychiatry" },
  { label: "Neuropsychiatry", value: "Neuropsychiatry" },
  {
    label: "Clinical Psychology (Allied)",
    value: "Clinical Psychology (Allied)",
  },
  {
    label: "Mental Health Nursing (Advanced Practice)",
    value: "Mental Health Nursing (Advanced Practice)",
  },
  { label: "Cardiology", value: "Cardiology" },
  { label: "Gastroenterology", value: "Gastroenterology" },
  { label: "Endocrinology", value: "Endocrinology" },
  { label: "Rheumatology", value: "Rheumatology" },
  { label: "Pulmonology", value: "Pulmonology" },
  { label: "Nephrology", value: "Nephrology" },
  { label: "Hematology", value: "Hematology" },
  { label: "Oncology", value: "Oncology" },
  { label: "Geriatrics", value: "Geriatrics" },
  { label: "Infectious Diseases", value: "Infectious Diseases" },
  { label: "Sleep Medicine", value: "Sleep Medicine" },
  { label: "Clinical Pharmacology", value: "Clinical Pharmacology" },
  { label: "Hospital Medicine", value: "Hospital Medicine" },
  { label: "Allergy & Immunology", value: "Allergy & Immunology" },
  { label: "Cardiothoracic Surgery", value: "Cardiothoracic Surgery" },
  { label: "Neurosurgery", value: "Neurosurgery" },
  { label: "Vascular Surgery", value: "Vascular Surgery" },
  { label: "Orthopedic Surgery", value: "Orthopedic Surgery" },
  { label: "Urology", value: "Urology" },
  { label: "Pediatric Surgery", value: "Pediatric Surgery" },
  { label: "Colorectal Surgery", value: "Colorectal Surgery" },
  { label: "Surgical Oncology", value: "Surgical Oncology" },
  { label: "Trauma Surgery", value: "Trauma Surgery" },
  { label: "Transplant Surgery", value: "Transplant Surgery" },
  { label: "Otolaryngology (ENT)", value: "Otolaryngology (ENT)" },
  {
    label: "Oral & Maxillofacial Surgery",
    value: "Oral & Maxillofacial Surgery",
  },
  {
    label: "Plastic, Reconstructive & Cosmetic Surgery",
    value: "Plastic, Reconstructive & Cosmetic Surgery",
  },
  {
    label:
      "Aesthetic Surgery (subspecialty of plastic surgery or standalone in some countries)",
    value:
      "Aesthetic Surgery (subspecialty of plastic surgery or standalone in some countries)",
  },
  {
    label: "Hair Transplant Surgery (emerging subspecialty)",
    value: "Hair Transplant Surgery (emerging subspecialty)",
  },
  {
    label: "Minimally Invasive / Laparoscopic Surgery",
    value: "Minimally Invasive / Laparoscopic Surgery",
  },
  { label: "Maternal-Fetal Medicine", value: "Maternal-Fetal Medicine" },
  { label: "Gynecologic Oncology", value: "Gynecologic Oncology" },
  {
    label: "Reproductive Endocrinology & Infertility",
    value: "Reproductive Endocrinology & Infertility",
  },
  { label: "Urogynecology", value: "Urogynecology" },
  { label: "Family Planning", value: "Family Planning" },
  { label: "Neonatology", value: "Neonatology" },
  { label: "Pediatric Cardiology", value: "Pediatric Cardiology" },
  { label: "Pediatric Neurology", value: "Pediatric Neurology" },
  { label: "Pediatric Oncology", value: "Pediatric Oncology" },
  { label: "Pediatric Gastroenterology", value: "Pediatric Gastroenterology" },
  {
    label: "Pediatric Infectious Disease",
    value: "Pediatric Infectious Disease",
  },
  { label: "Pediatric Endocrinology", value: "Pediatric Endocrinology" },
  { label: "Pediatric Nephrology", value: "Pediatric Nephrology" },
  { label: "Developmental Pediatrics", value: "Developmental Pediatrics" },
  {
    label:
      "Aesthetic Medicine (Non-surgical beauty & anti-aging: botox, fillers, lasers)",
    value:
      "Aesthetic Medicine (Non-surgical beauty & anti-aging: botox, fillers, lasers)",
  },
  { label: "Cosmetic Dermatology", value: "Cosmetic Dermatology" },
  {
    label: "Cosmetic Surgery (Focused on elective procedures for appearance)",
    value: "Cosmetic Surgery (Focused on elective procedures for appearance)",
  },
  { label: "Laser Medicine", value: "Laser Medicine" },
  { label: "Hair Restoration Medicine", value: "Hair Restoration Medicine" },
  {
    label:
      "Medical Spa / Anti-Aging Medicine (e.g., IV therapy, hormonal therapy)",
    value:
      "Medical Spa / Anti-Aging Medicine (e.g., IV therapy, hormonal therapy)",
  },
  {
    label: "Regenerative Aesthetic Medicine (PRP, stem cells, etc.)",
    value: "Regenerative Aesthetic Medicine (PRP, stem cells, etc.)",
  },
  { label: "Ophthalmology", value: "Ophthalmology" },
  { label: "Dermatology", value: "Dermatology" },
  { label: "Audiology (Allied)", value: "Audiology (Allied)" },
  { label: "Diagnostic Radiology", value: "Diagnostic Radiology" },
  { label: "Interventional Radiology", value: "Interventional Radiology" },
  { label: "Nuclear Medicine", value: "Nuclear Medicine" },
  { label: "Radiation Oncology", value: "Radiation Oncology" },
  { label: "Anatomical Pathology", value: "Anatomical Pathology" },
  { label: "Clinical Pathology", value: "Clinical Pathology" },
  { label: "Forensic Pathology", value: "Forensic Pathology" },
  { label: "Hematopathology", value: "Hematopathology" },
  { label: "Medical Microbiology", value: "Medical Microbiology" },
  { label: "Molecular Pathology", value: "Molecular Pathology" },
  { label: "Cytopathology", value: "Cytopathology" },
  { label: "Public Health Medicine", value: "Public Health Medicine" },
  { label: "Preventive Medicine", value: "Preventive Medicine" },
  { label: "Occupational Medicine", value: "Occupational Medicine" },
  { label: "Environmental Medicine", value: "Environmental Medicine" },
  { label: "Aerospace Medicine", value: "Aerospace Medicine" },
  { label: "Tropical Medicine", value: "Tropical Medicine" },
  { label: "Epidemiology", value: "Epidemiology" },
  { label: "Disaster Medicine", value: "Disaster Medicine" },
  { label: "Travel Medicine", value: "Travel Medicine" },
  { label: "Health Policy & Management", value: "Health Policy & Management" },
  { label: "Neurology", value: "Neurology" },
  { label: "Neurophysiology", value: "Neurophysiology" },
  { label: "Neurocritical Care", value: "Neurocritical Care" },
  {
    label: "Clinical Neuropsychology (Allied)",
    value: "Clinical Neuropsychology (Allied)",
  },
  {
    label: "Physical Medicine & Rehabilitation (PM&R)",
    value: "Physical Medicine & Rehabilitation (PM&R)",
  },
  { label: "Pain Medicine", value: "Pain Medicine" },
  { label: "Palliative Medicine", value: "Palliative Medicine" },
  {
    label: "Speech & Language Therapy (Allied)",
    value: "Speech & Language Therapy (Allied)",
  },
  {
    label: "Occupational Therapy (Allied)",
    value: "Occupational Therapy (Allied)",
  },
];

const options = [
  { label: "One Year", value: "1" },
  { label: "Two Years", value: "2" },
  { label: "Three Years", value: "3" },
  { label: "Four or More Years", value: "4+" },
  { label: "Clear filter", value: "" },
];

export default function FindDoctor() {
  const [doctors, setDoctors] = useState<UpdateDoctorData[]>([]);
  const [searchDoctor, setSearchDoctor] = useState<string>("");
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [specialityDropdownOpen, setSpecialityDropdownOpen] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const [availabilityDropdownOpen, setAvailabilityDropdownOpen] =
    useState(false);
  const dispatch = useDispatch();
  const specialityDropdownRef = useRef<HTMLDivElement>(null);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);
  const availabilityDropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(
    (opt) => opt.value === searchDoctor && opt.value !== "",
  );

  useEffect(() => {
    dispatch(loadingStart());
    getVerifiedDoctors()
      .then((data) => {
        setDoctors(data);
        dispatch(loadingEnd());
      })
      .catch((err) => {
        notifyFailure(err.toString());
      });
  }, [dispatch]);

  // console.log("ddddddd" , doctors);

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("connect", () => {});
    socket.on("doctorStatusUpdated", (updatedDoctor: UpdateDoctorData) => {
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor: UpdateDoctorData) =>
          doctor.id == updatedDoctor.id
            ? { ...doctor, online: updatedDoctor.online }
            : doctor,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAvailabilityChange = (value: string) => {
    if (value === "online") {
      setAvailability(true);
    } else if (value === "offline") {
      setAvailability(false);
    } else {
      setAvailability(null);
    }
    setAvailabilityDropdownOpen(false);
  };

  const handleDoctorChange = (doctor: string) => {
    setSearchDoctor(doctor);
    setDoctorDropdownOpen(false);
  };

  const handleDoctorSpecialityChange = (doctor: string) => {
    setSelectedSpeciality(doctor);
    setSpecialityDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      specialityDropdownRef.current &&
      !specialityDropdownRef.current.contains(event.target as Node)
    ) {
      setSpecialityDropdownOpen(false);
    }
    if (
      doctorDropdownRef.current &&
      !doctorDropdownRef.current.contains(event.target as Node)
    ) {
      setDoctorDropdownOpen(false);
    }
    if (
      availabilityDropdownRef.current &&
      !availabilityDropdownRef.current.contains(event.target as Node)
    ) {
      setAvailabilityDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <DashboardSection>
        <div className="flex justify-between my-4 flex-wrap">
          <h2 className="text-3xl sm:text-3xl font-semibold w-full sm:w-auto">
            Find Doctor
          </h2>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              title="Recently Viewed"
              className="w-fit"
              secondary={true}
            />
            <Button
              onClick={() => {
                setSearchDoctor("");
                setSelectedSpeciality("");
                setAvailability(null);
              }}
              title="Reset"
              className="w-fit"
              secondary={true}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center my-4 flex-wrap">
          <div
            className="w-full sm:w-auto mt-2 sm:mt-0 relative"
            ref={specialityDropdownRef}
          >
            <button
              onClick={() => setSpecialityDropdownOpen(!specialityDropdownOpen)}
              style={{ width: "14rem" }}
              className="mt-1 py-3.5 px-4 border border-indigo-500 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm relative flex justify-between items-center"
            >
              {selectedSpeciality || "Search By Speciality"}
              <svg
                className={`bg-indigo-500 w-4 h-4 ml-2 transition-transform duration-200 ${specialityDropdownOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {specialityDropdownOpen && (
              <ul className="absolute z-10 w-full max-h-60 overflow-y-auto mt-1 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
                {specializationOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleDoctorSpecialityChange(option?.label);
                    }}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className="w-full sm:w-auto mt-2 sm:mt-0 relative"
            ref={doctorDropdownRef}
          >
            <button
              onClick={() => setDoctorDropdownOpen(!doctorDropdownOpen)}
              style={{ width: "14rem" }}
              className="mt-1 py-3.5 px-4 border border-indigo-500 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm relative flex justify-between items-center"
            >
              {selectedOption?.label || "Search By Experience"}
              <svg
                className={`bg-indigo-500 w-4 h-4 ml-2 transition-transform duration-200 ${
                  doctorDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {doctorDropdownOpen && (
              <div className="absolute left-20 w-55 bg-white border border-indigo-500 rounded-md shadow-lg z-10">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`py-2 px-4 hover:bg-gray-100 cursor-pointer ${
                      option.value !== "" ? "border-b border-indigo-500" : ""
                    }`}
                    onClick={() => handleDoctorChange(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="w-full sm:w-auto mt-2 sm:mt-0 relative"
            ref={availabilityDropdownRef}
          >
            <button
              onClick={() =>
                setAvailabilityDropdownOpen(!availabilityDropdownOpen)
              }
              style={{ width: "14rem" }}
              className="mt-1 py-3.5 px-4 border border-indigo-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm relative flex justify-between items-center"
            >
              {availability === null
                ? "Search By Availability"
                : availability
                  ? "🟢 Online now"
                  : "⚪ Offline now"}
              <svg
                className={`bg-indigo-500 w-4 h-4 ml-2 transition-transform duration-200 ${availabilityDropdownOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {availabilityDropdownOpen && (
              <div className="absolute left-20 w-58 bg-white border border-indigo-500 rounded-md shadow-lg z-10">
                <div
                  className="border-b border-indigo-500 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAvailabilityChange("online")}
                >
                  🟢 Online now
                </div>
                <div
                  className="border-b border-indigo-500 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAvailabilityChange("offline")}
                >
                  ⚪ Offline now
                </div>
                <div
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAvailabilityChange("clear")}
                >
                  Clear filter
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {doctors?.length > 0 ? (
            doctors
              ?.filter((doctor: UpdateDoctorData) => {
                const matchesSearchDoctor =
                  searchDoctor === "" || doctor.experience === searchDoctor;
                const matchSpeciality =
                  selectedSpeciality === "" ||
                  doctor.specialization === selectedSpeciality;
                const matchesOnlineStatus =
                  availability === null
                    ? doctor
                    : availability === true
                      ? doctor.online
                      : !doctor.online;
                return (
                  matchesSearchDoctor && matchSpeciality && matchesOnlineStatus
                );
              })
              ?.map((doctor: UpdateDoctorData) => {
                return (
                  <Link
                    to={`/patient-dashboard/find-doctor/select-slot/${doctor?.id}`}
                    key={doctor?.id}
                  >
                    <div className="border-primary border rounded-lg p-3 cursor-pointer">
                      <div className="flex flex-col sm:flex-row justify-between gap-2 my-2">
                        <div className="w-full sm:w-1/5 mb-4 sm:mb-0 relative">
                          {doctor?.image ? (
                            <ImageUrl fileKey={doctor?.image} />
                          ) : (
                            <img
                              src={doctorImg}
                              alt="Doctor"
                              className="w-full h-auto p-2 rounded-full block mx-auto"
                            />
                          )}
                          <div
                            className={`absolute top-7 right-6 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white ${
                              doctor.online ? "bg-green-500" : "bg-gray-500"
                            }`}
                          ></div>
                        </div>
                        <div className="w-full sm:w-3/5 order-2 sm:order-1">
                          <h2 className="text-xl sm:text-3xl font-medium">
                            {doctor.first_name} {doctor.last_name}
                          </h2>
                          {doctor?.qualification ||
                            "BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS"}
                          <p>{doctor?.specialization}</p>
                          <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <div>
                              <p>Reviews</p>
                              <p>195</p>
                            </div>
                            <div>
                              <p>Experience</p>
                              <p>{doctor?.experience} years</p>
                            </div>
                            <div>
                              <p>Satisfaction</p>
                              <p>100%</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-1/5 flex flex-col gap-4 order-1 sm:order-2">
                          <Button title="Video Call" secondary={true} />
                          <Link
                            to={`/patient-dashboard/find-doctor/profile/${doctor.id}`}
                          >
                            <Button title="View Profile" secondary={true} />
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 my-2">
                        <div className="border-primary border w-full sm:w-1/3 p-2 rounded-lg flex flex-col gap-2">
                          <p className="text-sm">{doctor?.consultation_mode}</p>
                          <p className="text-sm">Available today</p>
                          <p className="text-sm">
                            fee:{" "}
                            <span className="font-medium text-primary">
                              ${doctor?.consultation_fee_regular}
                            </span>
                          </p>
                          <p className="text-sm">
                            discounted:{" "}
                            <span className="font-medium text-primary">
                              ${doctor?.consultation_fee_discounted}
                            </span>
                          </p>
                          <p className="text-sm">
                            total:{" "}
                            <span className="font-semibold text-primary">
                              {doctor?.consultation_fee_regular &&
                              doctor?.consultation_fee_discounted
                                ? `$ ${Math.round(doctor.consultation_fee_regular - (doctor.consultation_fee_regular * doctor.consultation_fee_discounted) / 100)}`
                                : "N/A"}
                            </span>
                          </p>
                        </div>
                        <div className="border-primary border w-full sm:w-2/3 p-2 rounded-lg">
                          <h5 className="text-base">
                            Smile Solutions | Dental Clinic | Orthodontic &
                            Implant Centre, Model Town, Lahore
                          </h5>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
          ) : (
            <div className="text-center text-2xl font-medium mt-6">
              No doctors found.
            </div>
          )}
        </div>
      </DashboardSection>
    </>
  );
}
