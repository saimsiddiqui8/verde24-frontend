import React from "react";
import { Button, TimePicker } from "../../../../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import DatePicker from "../../../../components/DatePicker";
import { useDispatch } from "react-redux";
import {
  addPatientaddress,
  deletePatientDetail,
} from "../../../../redux/slices/LabBooking";
import { notifyFailure } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { labTests } from "../../../../api/apiCalls/types";

interface StepProps {
  prevStep: () => void;
  data?: labTests[];
}

interface PatientSlotLab {
  slot_time: string;
  weekday: string;
  date: string;
}

const UserSchema = z.object({
  slot_time: z.string().min(1, { message: "Slot Time is required" }),
  date: z.string().min(1, { message: "date is required" }),
});
const SelectTimeSlot: React.FC<StepProps> = ({ prevStep, data }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientSlotLab>({ resolver: zodResolver(UserSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<PatientSlotLab> = async (
    data: PatientSlotLab,
  ) => {
    const selectedDate = new Date(data.date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      notifyFailure("Please select a future date.");
      return;
    }

    const day = selectedDate.getDate();
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
    const month = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    let [hours, minutes] = data.slot_time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;

    const weekday = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    dispatch(
      addPatientaddress({
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        appointment_weekday:
          weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase(),
      }),
    );

    reset();
    navigate("/patient-dashboard/book-lab-test/checkout-lab");
  };

  const handleBack = () => {
    dispatch(deletePatientDetail());
    prevStep();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-between">
          <div className="w-full lg:w-3/6 flex flex-col gap-4">
            <h1 className="text-[#3FB946] text-2xl font-bold my-3">
              Select Time Slot
            </h1>
            <div className={`w-full px-6 flex flex-col gap-4`}>
              <TimePicker
                label="Slot Start Time"
                properties={{ ...register("slot_time") }}
                error={errors["slot_time"]}
              />
              <DatePicker
                label="Select Date"
                properties={{ ...register("date") }}
                error={errors["date"]}
              />
            </div>
          </div>

          {(data ?? [])?.map((item: labTests, index: number) => (
            <div
              key={index}
              className="w-full lg:w-3/6 bg-white p-6 md:p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-16 h-full flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
                Your Cart &nbsp;
                <span className="text-lg text-[#3FB946]">{index + 1} Test</span>
              </h3>

              <div className="pb-2 mb-4">
                <div className="flex justify-between border-y border-y-gray-500 py-3">
                  <span>{item.title}</span>
                  <span>${item.price}</span>
                </div>
                <p className="text-primary text-gray-600 mt-4">Preparation</p>
                <p className="text-primary text-gray-600 leading-5">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-around py-3 mt-6 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
                <span className="text-[#3FB946]">Total</span>
                <span className="text-[#3FB946]">${item.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center lg:justify-between gap-4 sm:gap-8 mt-5">
          <Button
            type="button"
            onClick={handleback}
            title="Go Back"
            secondary={true}
            className="rounded-xl w-40 sm:w-44 text-lg sm:text-xl p-3 lg:ms-4"
          />
          <Button
            title="continue"
            secondary={true}
            className="rounded-xl w-40 sm:w-44 text-lg sm:text-xl p-3 lg:mr-24"
          />
        </div>
        <Toaster />
      </form>
    </>
  );
};

export default SelectTimeSlot;
