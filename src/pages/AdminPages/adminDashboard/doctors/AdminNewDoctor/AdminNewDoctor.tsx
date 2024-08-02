import {
  DashboardSection,
  InputField,
  RadioInput,
} from "../../../../../components";
import { useState, ChangeEvent, FormEvent } from "react";
import { Toaster } from "react-hot-toast";
import {
  areAllValuesTruthy,
  notifyFailure,
  notifySuccess,
} from "../../../../../utils/Utils";
import { publicRequest } from "../../../../../api/requestMethods";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { DOCTORS_QUERY } from "./queries";

const inputs = [
  {
    label: "First Name",
    type: "text",
    placeholder: "Enter Your Complete Name",
    name: "first_name",
  },
  {
    label: "Last Name",
    type: "text",
    placeholder: "Select Your Gender",
    name: "last_name",
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
    name: "email",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
  },
  {
    label: "Gender",
    type: "radio",
    placeholder: "Enter Your Gender",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
  {
    label: "Password",
    type: "password",
    placeholder: "Enter Your Password",
    name: "password",
  },
];

type InputValues = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
};

const initialValue: InputValues = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  gender: "",
};



export default function AdminNewDoctor() {
  const [inputValues, setInputValues] = useState<InputValues>(initialValue);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createDoctor = async (data: object) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTORS_QUERY,
        variables: { data },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating doctor:");
      throw error;
    }
  };

  const { mutate } = useMutation(createDoctor);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev: InputValues) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      Object.keys(inputValues)?.length === inputs?.length &&
      areAllValuesTruthy(inputValues)
    ) {
      mutate(inputValues, {
        onSuccess: mutateSuccess,
        onError: mutateFail,
      });
    } else {
      notifyFailure("Please fill all the fields!");
    }
  };

  function mutateSuccess() {
    notifySuccess("New Doctor Created! Redirecting...");
    queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
    setTimeout(() => {
      navigate("/admin-dashboard/doctors");
    }, 1000);
  }

  function mutateFail() {
    notifyFailure("Doctor creation failed!");
  }

  return (
    <DashboardSection title="Add New Doctor">
  <form onSubmit={handleSubmit} className="pt-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
      {inputs?.map((input,index) => (
        <div key={index} className="col-span-1">
          {input.type === "radio" ? (
            <RadioInput
              label={input?.label}
              options={input?.options}
              name={input?.name}
              onChange={handleChange}
              selected={inputValues[input.name as keyof InputValues]}
            />
          ) : (
            <InputField
              label={input?.label}
              name={input?.name}
              placeholder={input?.placeholder}
              type={input?.type}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-center my-4">
      <button className="form-btn w-full sm:w-auto px-6">Submit</button>
    </div>
    <Toaster />
  </form>
</DashboardSection>

  );
}

// interface Inputs {
//   [key: string]: string | string[] | boolean;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string;
//   gender: string;
//   password: string;
// }
