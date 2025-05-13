import React from "react";
import {
  Button,
  InputField,
  PhoneInputComp,
  RadioInput,
} from "../../../../components";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { isPhoneValid } from "../../../../utils/Utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import {
  addPatientdetail,
  clearAlllabTests,
  deleteLabDetail,
} from "../../../../redux/slices/LabBooking";
import { labTests } from "../../../../api/apiCalls/types";

interface StepProps {
  nextStep: () => void;
  data?: labTests[];
  id?: number | null;
}

const inputs = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Your First Name",
    name: "name",
    error: false,
  },
  {
    label: "Add Your Age",
    type: "number",
    placeholder: "Enter Your Age",
    name: "age",
    error: false,
  },
  {
    label: "Phone Number",
    type: "phone",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
    error: false,
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
    name: "email",
    error: false,
  },
  {
    label: "Gender",
    type: "radio",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
    error: false,
  },
];

const UserSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    age: z.preprocess(
      (value) => Number(value),
      z.number().min(1, { message: "Age is required" }),
    ),
    email: z.string().min(1, { message: "Email is required" }).email(),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    gender: z
      .string({
        invalid_type_error: "Gender is required",
      })
      .min(1, { message: "Gender is required" }),
  })
  .refine((data) => isPhoneValid(data.phone_number), {
    message: "Invalid Phone Number",
    path: ["phone_number"],
  });

interface PatientDataLab {
  name: string;
  age: number;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "other";
}

const PatientDetails: React.FC<StepProps> = ({ nextStep, data, id }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientDataLab>({ resolver: zodResolver(UserSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<PatientDataLab> = async (
    data: PatientDataLab,
  ) => {
    dispatch(
      addPatientdetail({
        patient_name: data?.name,
        patient_email: data?.email,
        patient_age: data?.age,
        patient_gender: data?.gender,
        patient_phone_number: data?.phone_number,
      }),
    );
    reset();
    nextStep();
  };

  const handleBack = () => {
    dispatch(deleteLabDetail());
    dispatch(clearAlllabTests());
    navigate(`/patient-dashboard/book-lab-test/lab-profile/${id}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-between">
          <div className="w-full lg:w-3/6 flex flex-col gap-4">
            <h1 className="text-[#3FB946] text-2xl font-bold my-3">
              Add Patient Details
            </h1>
            {inputs?.map((input, index) => (
              <div key={index} className={`w-full px-6 min-h-[70px]`}>
                {input.type === "radio" ? (
                  <RadioInput
                    label={input?.label}
                    name={input?.name}
                    options={input?.options}
                    properties={{
                      ...register(input?.name as keyof PatientDataLab),
                    }}
                    error={errors[input?.name as keyof PatientDataLab]}
                    className="w-full"
                  />
                ) : input.type === "phone" ? (
                  <PhoneInputComp
                    properties={{
                      ...register(input?.name as keyof PatientDataLab),
                    }}
                    error={errors[input?.name as keyof PatientDataLab]}
                    className="w-full"
                  />
                ) : (
                  <InputField
                    label={input.label}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    properties={{
                      ...register(input?.name as keyof PatientDataLab),
                    }}
                    error={errors[input?.name as keyof PatientDataLab]}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
{data?.[0] && (
  <div
    key={0}
    className="w-full lg:w-3/6 bg-white p-6 md:p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-16 h-full flex flex-col justify-center"
  >
    <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
      Your Cart &nbsp;
      <span className="text-lg text-[#3FB946]">1 Test</span>
    </h3>

    <div className="pb-2 mb-4">
      <div className="flex justify-between border-y border-y-gray-500 py-3">
        <span>{data[0].title}</span>
        <span>${data[0].price}</span>
      </div>
      <p className="text-primary text-gray-600 mt-4">Preparation</p>
      <p className="text-primary text-gray-600 leading-5">
        {data[0].description}
      </p>
    </div>

    <div className="flex justify-around py-3 mt-6 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
      <span className="text-[#3FB946]">Total</span>
      <span className="text-[#3FB946]">${data[0].price}</span>
    </div>
  </div>
)}


        </div>
        {(data ?? []).length > 1 && 
  <div className="flex flex-wrap gap-4">
    {data && data?.slice(1).map((item: labTests, index: number) => (
      <div
        key={index}
        className="flex-1 min-w-[280px] max-w-[450px] bg-white p-6 md:p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-16 h-full flex flex-col justify-center"
      >
        <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
          Your Cart &nbsp;
          <span className="text-lg text-[#3FB946]">{index + 2} Test</span> 
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
}

        
        <div className="flex flex-wrap justify-center lg:justify-between gap-4 sm:gap-8 mt-5">
          <Button
            type="button"
            onClick={handleBack}
            title="Go Back"
            secondary={true}
            className="rounded-xl w-28 text-lg sm:text-xl p-3 lg:ms-4"
          />
          <Button
            title="continue"
            secondary={true}
            className="rounded-xl w-28 text-lg sm:text-xl p-3 lg:mr-4"
          />
        </div>
      </form>
    </>
  );
};

export default PatientDetails;
