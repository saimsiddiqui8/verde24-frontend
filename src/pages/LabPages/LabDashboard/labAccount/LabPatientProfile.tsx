import { Button, DashboardSection, DropdownField, TimePicker } from "../../../../components";
import testlogo from "../../../../assets/labprofile/testlogo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  slot_time: z.string().min(1, { message: "Slot Time is required" }),
  weekday: z.string().min(1, { message: "Week day is required" }),
});


const tests = [
  {
    name: "Collen",
    test: "Vitamin A Blood Test",
    date: "Mon, 25 Dec 2024",
    urgency: 1,
  },
];

const cartDetails = {
  testName: "Vitamin A Blood",
  price: 2000,
  task : "Preparation",
  preparation:
  "For this test, you may be asked to fast for upto 24 hours before test.For this test, you may be asked to fast for upto 24 hours before test.",
  pickupCharges: 0,
};


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

const LabPatientProfile = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ resolver: zodResolver(FormSchema) });




  const onSubmit= (data : any) => {
    console.log("Form Data:", data);
  };

  return (
    <DashboardSection title="View Test Details">
      <div className="flex flex-wrap justify-between">
        {/* Test Details Section */}
        <div className="w-full lg:w-3/5 ">
          {tests.map((test, index) => (
            <div
              key={index}
              className="w-3/4 flex items-center justify-between p-3 mb-2 border border-gray-300 rounded-lg bg-white mt-4"
            >
              <img
                src={testlogo}
                alt="profile"
                className="rounded-full w-12 h-12"
              />
              <div className="flex-1 ml-4">
                <div className="font-bold">{test.name}</div>
                <div>{test.test}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="mr-3 my-1 text-sm text-gray-600 text-primary">
                  {test.date}
                </div>
                <div className="flex justify-center items-center gap-1">
                  <div className="flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full">
                    {test.urgency}
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div className="w-3/4 "> 
        <h1 className="text-[#3FB946] text-2xl font-bold my-4">Select Time Slot</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <TimePicker
                      label="Slot Start Time"
                      properties={{ ...register("slot_time") }}
                      error={errors["slot_time"]}
                    />
                    <DropdownField
        label={input.label}
        name={input.name}
        options={input.options}
        placeholder={input.placeholder}
        properties={{ ...register(input.name) }}
        error={errors[input.name]?.message}
      />
                   
                   <Button title="Add" className="w-28"/>
                  </form>
        </div>
        </div>

        {/* Your Cart Section */}
        <div className="w-full lg:w-2/5 bg-white p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-0 " >
          <h3 className="text-2xl font-bold text-[#3FB946] mb-4">Your Cart &nbsp; <span className="text-lg text-[#3FB946]"> 1 Test</span></h3>
          <div className="pb-2 mb-2">
            <div className="flex justify-between border-y border-y-gray-500 py-2.5">
              <span>{cartDetails.testName}</span>
              <span className="">${cartDetails.price}</span>
            </div>
            
            <p className="text-primary text-gray-600 mt-4">{cartDetails.task}</p>
            <p className="text-primary text-gray-600 leading-5">{cartDetails.preparation}</p>
          </div>
          <div className="flex justify-between text-sm mb-2 border-y border-y-gray-500 py-2">
            <span>Pickup Charges</span>
            <span>${cartDetails.pickupCharges}</span>
          </div>
          <div className="flex justify-evenly w-64 py-2 m-auto mt-5 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
            <span className="text-[#3FB946]">Total</span>
            <span className="text-[#3FB946]">${cartDetails.price + cartDetails.pickupCharges}</span>
          </div>
          <div className="flex justify-end mt-4 gap-4">
            <Button title="Cancel" className=" rounded-lg"/>
              
            <Button title="Confirm Now" className="rounded-lg"/>
              
          </div>
        </div>
      </div>
    </DashboardSection>
  );
};

export default LabPatientProfile;
