import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, DashboardSection } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { Doctor, TimeSlot } from "../../../../api/apiCalls/types";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import {
  getDoctorById,
  getDoctorTimeSlots,
} from "../../../../api/apiCalls/doctorsApi";
import {
  GET_DOCTOR_QUERY,
  GET_DOCTOR_TIMESLOTS,
} from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { notifyFailure } from "../../../../utils/Utils";
import { addBooking } from "../../../../redux/slices/bookingSlice";
import { RootState } from "../../../../redux/store";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DateInfo = {
  date: number;
  fullDate: string;
  dayOfWeek: number;
};

type Slot = {
  id: number;
  doctorTimeSlotId: number;
  time: string;
  status: string;
};

const getMonthDates = (): DateInfo[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const monthDates: DateInfo[] = [];

  for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
    const currentDate = new Date(year, month, date);
    const dayOfWeek = (currentDate.getDay() + 6) % 7;
    const formattedDate: DateInfo = {
      date: date,
      fullDate: `${date} ${monthNames[month]} ${year}`,
      dayOfWeek,
    };
    monthDates.push(formattedDate);
  }

  return monthDates;
};

const getCurrentDate = () => {
  const today = new Date();
  const day = today.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function SelectSlot() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [doctorTimeSlots, setDoctorTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>("Monday");
  const [selectedTime, setSelectedTime] = useState<string | null>("");
  const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
  const [monthDates] = useState(getMonthDates());
  const numericId = id ? parseInt(id, 10) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booking = useSelector((state: RootState) => state.booking);
  const date = booking?.selectedDate;
  const day = booking?.selectedDay;
  const time = booking?.selectedTime;

  useEffect(() => {
    if (date && day && time) {
      setSelectedDate(date);
      setSelectedDay(day);
      setSelectedTime(time);
    }

    if (!id) {
      dispatch(loadingStart());
      return;
    }

    const fetchDoctor = async () => {
      dispatch(loadingStart());
      try {
        const doctorData = await getDoctorById(GET_DOCTOR_QUERY, {
          findDoctorByIdId: numericId,
        });
        setDoctor(doctorData);
        dispatch(loadingEnd());
      } catch (err: any) {
        notifyFailure(err.toString());
      }
    };

    fetchDoctor();

    const getDoctorTimeslot = async () => {
      dispatch(loadingStart());
      try {
        const timeSlots = await getDoctorTimeSlots(GET_DOCTOR_TIMESLOTS, {
          findDoctorTimeSlotsId: numericId,
        });
        setDoctorTimeSlots(timeSlots);
        dispatch(loadingEnd());
      } catch (err: any) {
        notifyFailure(err.toString());
      }
    };

    getDoctorTimeslot();
  }, [id, dispatch, date, day, time]);

  const groupedDates = daysOfWeek.map((_, index) =>
    monthDates.filter((date) => date.dayOfWeek === index),
  );

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setSelectedDate(null);
  };

  const currentDate = new Date();
  const handleDateSelect = (date: DateInfo) => {
    if (date.date < currentDate.getDate()) {
      alert("Please select a future date.");
      return;
    }
    setSelectedDate(date);
    setSelectedDay(daysOfWeek[date.dayOfWeek]);
  };
  const handleTimeSelect = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and a time slot.");
      return;
    }
    const cash = 100;
    const type = "usd";
    dispatch(
      addBooking({
        selectedDate: selectedDate,
        selectedDay: selectedDay,
        selectedTime: selectedTime,
        id: numericId,
        amount: cash,
        currency: type,
      }),
    );
    navigate(`/patient-dashboard/find-doctor/book-slot/${id}`);
  };

  const getTimeSlotsForSelectedDay = () => {
    const selectedDaySlots = doctorTimeSlots
      .filter((slot) => slot.weekday === selectedDay)
      .flatMap((slot) => slot.timeSlots);

    return selectedDaySlots.length > 0 ? selectedDaySlots : null;
  };

  const selectedDaySlots = getTimeSlotsForSelectedDay();

  const baseStyles =
    "border-2 py-1.5 px-3 rounded-[12px] cursor-pointer font-bold text-center";
  const selectedStyles =
    "bg-gradient-to-b from-[#3FB946] via-[#3DB54B] via-[#3BB150] to-[#125DB9] text-white";
  const dayStyles = `${baseStyles} border-primary text-gray-600`;

  const dateBaseStyles =
    "bg-gradient-to-b from-[#125DB9] to-[#092F5D] text-white border-none py-1.5 px-3 rounded-[8px]  cursor-pointer font-bold text-center";
  const dateSelectedStyles = selectedStyles;

  const timeBaseStyles =
    "bg-gradient-to-b from-[#125DB9] to-[#092F5D] text-white border-none py-1.5 px-3 rounded-[8px] cursor-pointer font-bold text-center";
  const timeSelectedStyles = selectedStyles;
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Get Appointment Online</h2>
        <div className="flex gap-2">
          <Button title="Recently Viewed" className="w-fit" secondary />
        </div>
      </div>

      {doctor && (
        <div key={doctor?.id} className="flex flex-col gap-4">
          <div className="border-primary border rounded-lg p-3">
            <div className="flex flex-col md:flex-row justify-between gap-2 my-2">
              <div className="w-full md:w-1/5 mb-4 md:mb-0">
                <img
                  src={doctorImg}
                  alt="Doctor"
                  className="w-full h-auto p-2 rounded-full block mx-auto"
                />
              </div>
              <div className="w-full md:w-3/5">
                <h2 className="text-xl md:text-3xl font-medium">
                  {doctor.first_name} {doctor.last_name}
                </h2>
                <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
                <p>Dentist</p>
                <div className="flex flex-col md:flex-row justify-between gap-2">
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
              <div className="w-full md:w-1/5 flex justify-center md:justify-end items-end mb-3">
                <Link to={`/patient-dashboard/find-doctor/profile/${id}`}>
                  <Button title="View Profile" secondary={true} />
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 my-2">
              <div className="border-primary border w-full md:w-1/3 p-2 rounded-lg flex flex-col gap-2">
                <p className="text-sm">Video Consultation</p>
                <p className="text-sm">Available today</p>
                <p className="text-sm">Rs 2500</p>
              </div>
              <div className="border-primary border w-full md:w-2/3 p-2 rounded-lg">
                <h5 className="text-base">
                  Smile Solutions | Dental Clinic | Orthodontic & Implant
                  Centre, Model Town, Lahore
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border-primary border p-5 rounded-lg my-2">
        <div className="flex justify-between my-4">
          <h3 className="text-2xl font-bold">Select Slot</h3>
          <p className="text-lg font-bold">{getCurrentDate()}</p>{" "}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, dayIndex) => (
            <div key={dayIndex} className="text-center">
              <div
                className={`${dayStyles} ${selectedDay === day ? selectedStyles : ""}`}
                onClick={() => handleDaySelect(day)}
              >
                <p
                  className="font-bold text-sm"
                  style={{
                    color: selectedDay === day ? "white" : "",
                  }}
                >
                  {day}
                </p>
              </div>
              <div className="mt-2">
                {groupedDates[dayIndex].map((dateInfo, index) => (
                  <div
                    key={index}
                    className={`${dateBaseStyles} mt-1 ${selectedDate?.date === dateInfo.date ? dateSelectedStyles : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateSelect(dateInfo);
                    }}
                  >
                    <p
                      className="text-sm"
                      style={{
                        color: "white",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      {dateInfo.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="my-5">
          <h3 className="text-2xl font-bold">Select Slot Time</h3>
          <div className="grid grid-cols-6 gap-4 mt-5">
            {selectedDaySlots && selectedDaySlots.length > 0 ? (
              selectedDaySlots.map((slot: Slot, index: number) => (
                <div
                  key={index}
                  className={`${timeBaseStyles} mt-1 ${slot?.status === "Booked" && "opacity-50"} py-2.5 ${selectedTime === slot.time ? timeSelectedStyles : ""}`}
                  onClick={() => {
                    if (slot?.status !== "Booked") {
                      setSelectedTime(slot.time);
                    }
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "white", fontFamily: "Arial, sans-serif" }}
                  >
                    {slot?.status === "Booked" ? "Booked" : slot.time}
                  </p>
                </div>
              ))
            ) : (
              <h4 className="text-center text-2xl font-bold my-5">
                No Slots Available
              </h4>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              handleTimeSelect();
            }}
            title="Proceed next"
            className="w-fit mt-5"
            secondary={true}
          />
        </div>
      </div>
    </DashboardSection>
  );
}
