import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, DashboardSection } from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";
import { useEffect, useState } from "react";
import { Doctor } from "../../../../api/apiCalls/types";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { getDoctorById } from "../../../../api/apiCalls/doctorsApi";
import { GET_DOCTOR_QUERY } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { notifyFailure } from "../../../../utils/Utils";
import bank from "../../../../assets/payment/bank.png";
import cash from "../../../../assets/payment/cash.png";
import tranzact from "../../../../assets/payment/tranzact.png";
import visa from "../../../../assets/payment/visa.png";
import clock from "../../../../assets/clock.png";
import calender from "../../../../assets/calendar.png";
import bar from "../../../../assets/bar.png";
import { RootState } from "../../../../redux/store";
import {
  deleteBooking,
  updateBooking,
} from "../../../../redux/slices/bookingSlice";

const paymentMethods = [
  { id: 1, name: "Visa", imgSrc: visa },
  { id: 2, name: "Bank", imgSrc: bank },
  { id: 3, name: "Cash", imgSrc: cash },
  { id: 4, name: "Tranzact", imgSrc: tranzact },
];

export default function BookSlot() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const numericId = id ? parseInt(id, 10) : null;
  const booking = useSelector((state: RootState) => state.booking);
  const { selectedDate, selectedDay, selectedTime } = booking;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDate || !selectedDay || !selectedTime) {
      navigate(-1);
      return;
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
  }, [id, dispatch, selectedDate, selectedDay, selectedTime]);

  const cancelBooking = () => {
    dispatch(deleteBooking());
    navigate(-1);
  };

  const editSlot = () => {
    dispatch(
      updateBooking({
        selectedDate: selectedDate,
        selectedDay: selectedDay,
        selectedTime: selectedTime,
      }),
    );

    navigate(-1);
  };
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Get Appointment Online</h2>
        <div className="flex gap-2">
          <Button title="Recently Viewed" className="w-fit" secondary={true} />
          <Button
            onClick={() => {
              cancelBooking();
            }}
            title="Cancel"
            className="w-fit"
            secondary={true}
          />
          <Button title="Save Slot" className="w-fit" secondary={true} />
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

      <div className="border-primary border p-5 rounded-lg my-3">
        <h3 className="text-3xl font-bold mb-4">Selected Slots</h3>

        {/* Time Slot */}
        <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
          <div className="flex items-center space-x-4 ms-3">
            <img src={clock} alt="Clock icon" />
            <h4 className="text-lg">Time</h4>
          </div>
          <p className="text-primary text-lg text-center flex-1 -ms-24">
            {selectedTime ?? "No Data"}
          </p>
        </div>

        {/* Date Slot */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 ms-3">
            <img src={calender} alt="Calendar icon" />
            <h4 className="text-lg">Date</h4>
          </div>
          <p className="text-primary text-lg text-center flex-1 -ms-16">
            {selectedDate?.fullDate ?? "No Data"}
          </p>
        </div>

        {/* Day Slot with Edit Button */}
        <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
          <div className="flex items-center space-x-4 ms-3">
            <img src={bar} alt="Bar icon" />
            <h4 className="text-lg">Day</h4>
          </div>
          <p className="text-primary text-lg text-center flex-1">
            {selectedDay ?? "No Data"}
          </p>
          <button
            onClick={() => editSlot()}
            className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-8 py-2 rounded-[15px]"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="border-primary border p-5 rounded-lg my-2">
        <h3 className="text-2xl font-bold mb-4">Select Payment Method</h3>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="w-full border-primary border p-4 rounded-lg mb-2"
          >
            <Link to={`/patient-dashboard/find-doctor/checkout`}>
              <img
                src={method.imgSrc}
                alt={`${method.name} Payment Method`}
                className="w-30"
              />
            </Link>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}
