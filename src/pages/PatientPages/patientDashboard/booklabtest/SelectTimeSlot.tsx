import React from "react";
import { Button, DropdownField, TimePicker } from "../../../../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import DatePicker from "../../../../components/DatePicker";
import { useDispatch } from "react-redux";
import { addPatientaddress, deletePatientDetail } from "../../../../redux/slices/LabBooking";

type LabTestType = {
  id: number;
  title: string;
  description: string;
  price: number;
  pickupCharge: number;
  labId: number;
  createdAt: string;
  images: string[];
};

interface StepProps {
  prevStep: () => void;
  data?:LabTestType
}
const input = {
  label: "Select a Day",
  name: "weekday",
  placeholder: "Select a Day",
  options: [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ],
};

interface PatientSlotLab {
  slot_time: string;
  weekday: string;
  date: string;
}



    const UserSchema = z.object({
      slot_time: z.string().min(1, { message: "Slot Time is required" }),
      weekday: z.string().min(1, { message: "Week day is required" }),
      date: z.string().min(1, { message: "date is required" }),
    });
const SelectTimeSlot: React.FC<StepProps> = ({ prevStep ,data}) => {
       const {
             register,
             handleSubmit,
             reset,
             formState: { errors },
           } = useForm<PatientSlotLab>({ resolver: zodResolver(UserSchema) });
          const navigate = useNavigate();
             const dispatch = useDispatch();
          const onSubmit:SubmitHandler<PatientSlotLab> = async (data:PatientSlotLab) => {
             dispatch(addPatientaddress({
              appointment_date:data?.date,
              appointment_time:data?.slot_time,
              appointment_weekday:data?.weekday,
                             }));
            reset();
            navigate("/patient-dashboard/book-lab-test/checkout-lab")
           };

             const handleback = ()=>{
                     dispatch(deletePatientDetail());
                     prevStep();
                   }
   return (
      <>
   <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-between">
      <div className="w-full lg:w-3/6 flex flex-col gap-4">
     <h1 className="text-[#3FB946] text-2xl font-bold my-3">Select Time Slot</h1>
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
                              <DropdownField
                  label={input.label}
                  name={input.name}
                  options={input.options}
                  placeholder={input.placeholder}
                  properties={{ ...register(input.name  as keyof PatientSlotLab) }}
                  error={errors[input.name  as keyof PatientSlotLab]}
                />
       </div>
   </div>
   
   
   <div className="w-full lg:w-3/6 bg-white p-6 md:p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-16 h-full flex flex-col justify-center">
      <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
        Your Cart &nbsp; <span className="text-lg text-[#3FB946]">1 Test</span>
      </h3>
      <div className="pb-2 mb-2">
        <div className="flex justify-between border-y border-y-gray-500 py-3">
          <span>{data?.title}</span>
          <span>${data?.price}</span>
        </div>
        <p className="text-primary text-gray-600 mt-4">Preparation</p>
        <p className="text-primary text-gray-600 leading-5">{data?.description}</p>
      </div>
      <div className="flex justify-around py-3 mt-6 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
        <span className="text-[#3FB946]">Total</span>
        <span className="text-[#3FB946]">${data?.price}</span>
      </div>
    </div>
     </div>
     <div className="flex flex-wrap justify-center lg:justify-between gap-4 sm:gap-8 mt-5">
       <Button type="button" onClick={handleback} title="Go Back" secondary={true} className="rounded-xl w-40 sm:w-44 text-lg sm:text-xl p-3 lg:ms-4" />
       <Button title="continue" secondary={true} className="rounded-xl w-40 sm:w-44 text-lg sm:text-xl p-3 lg:mr-24" />
     </div>
     </form>
       </>
  );
};

export default SelectTimeSlot;
