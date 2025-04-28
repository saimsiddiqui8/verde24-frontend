import {
  DashboardSection,
  InputField,
  PhoneInputComp,
  RadioInput,
} from "../../../../../components";
import { Toaster } from "react-hot-toast";
import {
  isPhoneValid,
  notifyFailure,
  notifySuccess,
} from "../../../../../utils/Utils";
import { publicRequest } from "../../../../../api/requestMethods";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { DOCTORS_QUERY } from "./queries";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";

const inputs = [
  {
    label: "First Name",
    type: "text",
    placeholder: "Enter Your First Name",
    name: "first_name",
    error: false,
  },
  {
    label: "Last Name",
    type: "text",
    placeholder: "Enter Your Last Name",
    name: "last_name",
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
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
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
  {
    label: "Password",
    type: "password",
    placeholder: "************",
    name: "password",
    error: false,
  },
];

interface Inputs {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  password: string;
}


const UserSchema = z
  .object({
    first_name: z.string().min(1, { message: "First Name is required" }),
    last_name: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email(),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    gender: z
      .string({
        invalid_type_error: "Gender is required",
      })
      .min(1, { message: "Gender is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(9, { message: "Password is too short" })
      .regex(/[A-Z]/, { message: "Please include an uppercase letter" })
      .regex(/[a-z]/, { message: "Please include a lowercase letter" })
      .regex(/\d/, {
        message: "Please include atleast one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Please include atleast one special character",
      }),
  })
  .refine((data) => isPhoneValid(data.phone_number), {
    message: "Invalid Phone Number",
    path: ["phone_number"],
  });

export default function AdminNewDoctor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(UserSchema) });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const createDoctor = async (data: Inputs) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTORS_QUERY,
        variables: { data },
      });
      return response?.data?.data?.createDoctor;
    } catch (error) {
      console.error("Error creating doctor:");
      throw error;
    }
  };

  const { mutate } = useMutation(createDoctor, {
    onMutate: () => {
      dispatch(loadingStart());
    },
    onSuccess: () => {
      dispatch(loadingEnd());
      notifySuccess("New Doctor Created! Redirecting...");
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
      setTimeout(() => {
        navigate("/admin-dashboard/doctors");
      }, 1000);
    },
    onError: (error) => {
      dispatch(loadingEnd());
      notifyFailure("Failed to create doctor!");
      console.error("Error creating doctor:", error);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    mutate(data);
  };

  return (
    <DashboardSection title="Add New Doctor">
      <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          {inputs?.map((input, index) => (
            <div key={index} className="col-span-1">
              {input.type === "radio" ? (
                <RadioInput
                  className={"my-0"}
                  label={input?.label}
                  name={input?.name}
                  options={input?.options}
                  properties={{ ...register(input?.name as keyof Inputs) }}
                  error={errors[input?.name as keyof Inputs]}
                />
              ) : input.type === "number" ? (
                <PhoneInputComp
                  className={"my-4"}
                  properties={{ ...register(input?.name as keyof Inputs) }}
                  error={errors[input?.name as keyof Inputs]}
                />
              ) : (
                <InputField
                  className={"my-4"}
                  label={input.label}
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  properties={{ ...register(input?.name as keyof Inputs) }}
                  error={errors[input?.name as keyof Inputs]}
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

