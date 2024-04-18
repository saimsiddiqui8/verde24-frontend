import {
  DashboardSection,
  InputField,
  RadioInput,
} from "../../../../../components";
import { useState } from "react";
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

const initialValue = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  gender: "",
};

export default function AdminNewDoctor() {
  const [inputValues, setInputValues] = useState<Inputs>(initialValue);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createDoctor = async (data: any) => {
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

  const handleChange = (e: any) => {
    setInputValues((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
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
        <div className="grid grid-cols-12 gap-x-4 gap-y-0">
          {inputs?.map((input) => (
            <div className="col-span-6">
              {input.type === "radio" ? (
                <RadioInput
                  label={input?.label}
                  options={input?.options}
                  name={input?.name}
                  onChange={handleChange}
                  selected={`${inputValues?.[input?.name]}`}
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
        <div className="mx-auto w-64">
          <button className="form-btn">Submit</button>
        </div>
        <Toaster />
      </form>
    </DashboardSection>
  );
}

interface Inputs {
  [key: string]: string | string[] | boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  password: string;
}
