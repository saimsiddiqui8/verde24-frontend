import { Button, DashboardSection } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { publicRequest } from "../../../../api/requestMethods";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { notifyFailure } from "../../../../utils/Utils";
import { BASE_URL } from "../../../../BaseUrl";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  password: string;
  is_verified: boolean;
  form_submitted: boolean;
  verification_code: string;
  verification_code_expiry: string;
  image: string;
  city: string;
  country: string;
  department: string;
  experience: string;
  registration_no: string;
  qualification: string;
  consultation_mode: string;
  consultation_fee_regular: number;
  consultation_fee_discounted: number;
  booking_lead_time: number;
  payout_method: string;
  payout_method_id: string;
  address: string;
  postal_code: string;
  services: string;
  specialization: string;
  bibliography: string;
  online: boolean;
}


const DOCTOR_QUERY = `
query FindDoctorsByVerificationStatus($isVerified: Boolean!) {
  findDoctorsByVerificationStatus(isVerified: $isVerified) {
    id
    online
    first_name
    last_name
    email
    phone_number
    gender
    password
    is_verified
    form_submitted
    verification_code
    verification_code_expiry
    image
    city
    country
    department
    experience
    registration_no
    qualification
    consultation_mode
    consultation_fee_regular
    consultation_fee_discounted
    booking_lead_time
    payout_method
    payout_method_id
    address
    postal_code
    services
    specialization
    bibliography
  }
}
`;

const variables = {
  isVerified: true, 
};
const getDoctors = async () => {
  try {
    const response = await publicRequest.post("/graphql", {
      query: DOCTOR_QUERY,
      variables: variables,
    });
    return response.data.data.findDoctorsByVerificationStatus;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export default function 
FindDoctor() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchDoctor, setSearchDoctor] = useState<string>("");
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [specialityDropdownOpen, setSpecialityDropdownOpen] = useState(false);
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const [availabilityDropdownOpen, setAvailabilityDropdownOpen] =
    useState(false);
  const dispatch = useDispatch();
  const specialityDropdownRef = useRef<HTMLDivElement>(null);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);
  const availabilityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadingStart());
    getDoctors()
      .then((data) => {
        setDoctors(data);
        dispatch(loadingEnd());
      })
      .catch((err) => {
        notifyFailure(err.toString());
      });
  }, [dispatch]);

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("connect", () => {});
    socket.on("doctorStatusUpdated", (updatedDoctor: Doctor) => {
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor: Doctor) =>
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
            <Button title="Reset" className="w-fit" secondary={true} />
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
              className="mt-1 block py-3.5 px-4 border border-indigo-500 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm relative flex justify-between items-center"
            >
              {"Search By Speciality"}
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
          </div>
          <div
            className="w-full sm:w-auto mt-2 sm:mt-0 relative"
            ref={doctorDropdownRef}
          >
            <button
              onClick={() => setDoctorDropdownOpen(!doctorDropdownOpen)}
              style={{ width: "14rem" }}
              className="mt-1 block py-3.5 px-4 border border-indigo-500 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm relative flex justify-between items-center"
            >
              {searchDoctor || "Search By Experience"}
              <svg
                className={`bg-indigo-500 w-4 h-4 ml-2 transition-transform duration-200 ${doctorDropdownOpen ? "rotate-180" : "rotate-0"}`}
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
                <div
                  className="border-b border-indigo-500 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDoctorChange("5+ Years")}
                >
                  5+ Years
                </div>
                <div
                  className="border-b border-indigo-500 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDoctorChange("10+ Years")}
                >
                  10+ Years
                </div>
                <div
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDoctorChange("")}
                >
                  Clear filter
                </div>
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
              className="mt-1 block py-3.5 px-4 border border-indigo-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm relative flex justify-between items-center"
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
          {doctors
            ?.filter((doctor: Doctor) => {
              const matchesSearchDoctor =
                searchDoctor.toLowerCase() === "" ||
                doctor.first_name
                  .toLowerCase()
                  .includes(searchDoctor.toLowerCase()) ||
                doctor.last_name
                  .toLowerCase()
                  .includes(searchDoctor.toLowerCase());
              const matchesOnlineStatus =
                availability === null
                  ? doctor
                  : availability === true
                    ? doctor.online
                    : !doctor.online;
              return matchesSearchDoctor && matchesOnlineStatus;
            })
            .map((doctor: Doctor) => {
              return  (
                <Link
                  to={`/patient-dashboard/find-doctor/appointment/${doctor.id}`}
                  key={doctor.id}
                >
                  <div className="border-primary border rounded-lg p-3 cursor-pointer">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 my-2">
                      <div className="w-full sm:w-1/5 mb-4 sm:mb-0 relative">
                        <img
                          src={doctorImg}
                          alt="Doctor"
                          className="w-full h-auto p-2 rounded-full block mx-auto"
                        />
                        <div
                          className={`absolute top-7 right-6 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white ${doctor.online ? "bg-green-500" : "bg-gray-500"}`}
                        ></div>
                      </div>
                      <div className="w-full sm:w-3/5 order-2 sm:order-1">
                        <h2 className="text-xl sm:text-3xl font-medium">
                          {doctor.first_name} {doctor.last_name}
                        </h2>
                        <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
                        <p>Dentist</p>
                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                          <div>
                            <p>Reviews</p>
                            <p>195</p>
                          </div>
                          <div>
                            <p>Experience</p>
                            <p>10 years</p>
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
                        <p className="text-sm">Video Consultation</p>
                        <p className="text-sm">Available today</p>
                        <p className="text-sm">Rs 2500</p>
                      </div>
                      <div className="border-primary border w-full sm:w-2/3 p-2 rounded-lg">
                        <h5 className="text-base">
                          Smile Solutions | Dental Clinic | Orthodontic &
                          Implant Centre, Model Town, Lahore
                        </h5>
                        <p className="text-sm">Available today</p>
                        <p className="text-sm">Rs 1000</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </DashboardSection>
    </>
  );
}
