import { Button, DashboardSection, InputField } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { publicRequest } from "../../../../api/requestMethods";
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { io } from 'socket.io-client';

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  online: boolean;
  experience: string;
  specialization: string;
  consultation_fee_regular: number;
}

const DOCTOR_QUERY = `
query {
  doctors {
    id,
    first_name,
    last_name,
    online,
    experience,
    specialization,
    consultation_fee_regular
  }
}
`
const getDoctors = async () => {
  try {
    const response = await publicRequest.post("/graphql", {
      query: DOCTOR_QUERY,
    });
    return response.data.data.doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export default function FindDoctor() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState<string>("");
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadingStart());
    getDoctors().then(data => {
      setDoctors(data);
      dispatch(loadingEnd());
    }).catch(err => {
      console.log(err.toString());
    });
  }, [dispatch]);

  useEffect(() => {
    const socket = io('http://localhost:8000/');

    socket.on('connect', () => {
      console.log('Connected to sockets');
    });
    socket.on('doctorStatusUpdated', (updatedDoctor: Doctor) => {
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor: Doctor) =>
          doctor.id === updatedDoctor.id ? { ...doctor, online: updatedDoctor.online } : doctor
        )
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
    setDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <DashboardSection>
        <div className="flex justify-between my-4 flex-wrap">
          <h2 className="text-xl sm:text-3xl font-semibold w-full sm:w-auto">Find Doctor</h2>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button title="Recently Viewed" className="w-fit" secondary={true} />
            <Button title="Reset" className="w-fit" secondary={true} />
          </div>
        </div>
        <div className="flex gap-2 items-center my-4 flex-wrap">
          <InputField label="Search By Speciality" className="flex-grow" />
          <InputField
            value={search}
            onChange={(e) => setSearch((e as React.ChangeEvent<HTMLInputElement>).target.value)}
            label="Search By Doctors"
            className="flex-grow"
          />
          <div className="w-full sm:w-auto mt-2 sm:mt-0 relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="mt-1 block w-full py-3.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm relative flex justify-between items-center"
            >
              {availability === null ? "Search By Availability" : availability ? "🟢 Online now" : "⚪ Offline now"}
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute mt-1 w-full py-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAvailabilityChange("online")}
                >
                  🟢 Online now
                </div>
                <div
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
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
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <Button title="Search" secondary={true} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {doctors?.filter((doctor: Doctor) => {
            const matchesSearch = search.toLowerCase() === "" || doctor.first_name.toLowerCase().includes(search.toLowerCase()) || doctor.last_name.toLowerCase().includes(search.toLowerCase());
            const matchesOnlineStatus = availability === null ? doctor : availability === true ? doctor.online : !doctor.online;
            return matchesSearch && matchesOnlineStatus;
          }).map((doctor: Doctor) => {
            return (
              <Link to={`/patient-dashboard/find-doctor/appointment/${doctor.id}`} key={doctor.id}>
                <div className="border-primary border rounded-lg p-3 cursor-pointer">
                  <div className="flex flex-col sm:flex-row justify-between gap-2 my-2">
                    <div className="w-full sm:w-1/5 mb-4 sm:mb-0 relative">
                      <img
                        src={doctorImg}
                        alt="Doctor"
                        className="w-full h-auto p-2 rounded-full block mx-auto"
                      />
                      <div className={`absolute top-7 right-6 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white ${doctor.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="w-full sm:w-3/5">
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
                    <div className="w-full sm:w-1/5 flex flex-col gap-2">
                      <Button title="Video Call" secondary={true} />
                      <Link to={`/patient-dashboard/find-doctor/profile/${doctor.id}`}>
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
                        Smile Solutions | Dental Clinic | Orthodontic & Implant Centre, Model Town, Lahore
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
