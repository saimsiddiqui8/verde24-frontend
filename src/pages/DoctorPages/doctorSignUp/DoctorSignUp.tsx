import image from "../../../assets/form-img.png";
import { useState, useEffect } from "react";
import {
  Button,
  InputField,
  Modal,
  PhoneInputComp,
  RadioInput,
} from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { Toaster } from "react-hot-toast";
import {
  isPhoneValid,
  notifyFailure,
  notifySuccess,
} from "../../../utils/Utils";
import { useDispatch } from "react-redux";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import {
  EXISTING_DOCTOR_QUERY,
  NEW_DOCTOR_QUERY,
  SEND_OTP_QUERY,
  VERIFY_OTP_QUERY,
} from "./queries";
import OTPInput from "react-otp-input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkDoctorEmail,
  createDoctor,
  sendDoctorOTP,
  verifyDoctorOTP,
} from "../../../api/apiCalls/doctorsApi";

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

const OtpSchema = z.object({
  otp: z
    .string()
    .min(1, { message: "Otp is required!" })
    .length(6, { message: "Enter all six digits!" }),
});

export default function DoctorSignUp() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(UserSchema) });
  const {
    formState: { errors: errorsModal },
    handleSubmit: handleSubmitModal,
    getValues: getValuesModal,
    control,
  } = useForm({
    resolver: zodResolver(OtpSchema),
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createNewDoctor = async (data: any) => {
    return createDoctor(NEW_DOCTOR_QUERY, { data });
  };

  const checkDuplicateEmail = async () => {
    return checkDoctorEmail(EXISTING_DOCTOR_QUERY, {
      email: getValues("email"),
    });
  };

  const sendOTP = async () => {
    return sendDoctorOTP(SEND_OTP_QUERY, {
      email: getValues("email"),
      role: "doctor",
    });
  };

  const doctorOTPData = useQuery({
    queryFn: sendOTP,
    enabled: false,
  });

  const verifyOTP = async () => {
    return verifyDoctorOTP(VERIFY_OTP_QUERY, {
      email: getValues("email"),
      role: "doctor",
      code: getValuesModal("otp"),
    });
  };

  const { mutate, data } = useMutation(createNewDoctor);

  const doctorEmail = useQuery({
    queryFn: checkDuplicateEmail,
    enabled: false,
  });

  const verifyOTPData = useQuery({
    queryFn: verifyOTP,
    enabled: false,
  });

  const handleLogin = () => {
    dispatch(loadingStart());
    mutate(getValues());
  };

  const sendOtp = async () => {
    dispatch(loadingStart());
    const otp = await doctorOTPData.refetch();
    if (otp?.data?.id) {
      notifySuccess("OTP is sent to your email. Please Verify!");
      setShowOTPModal(true);
    }
    dispatch(loadingEnd());
  };

  const onSubmit = async () => {
    dispatch(loadingStart());
    const email = await doctorEmail.refetch();
    if (email?.data?.id) {
      setError(
        "email",
        { message: "Email Already Exists!" },
        { shouldFocus: true }
      );
      dispatch(loadingEnd());
    } else {
      await sendOtp();
    }
  };

  useEffect(() => {
    if (data) {
      reset();
      if (data?.email) {
        notifySuccess("Sign Up Success.");
        setTimeout(() => {
          navigate("/doctor/sign-in");
        }, 1000);
      } else {
        notifyFailure(data?.error || "Sign Up Failure.");
      }
      dispatch(loadingEnd());
    }
  }, [data]);

  const handleOTPSubmit = async () => {
    dispatch(loadingStart());
    const verify = await verifyOTPData.refetch();
    dispatch(loadingEnd());
    console.log(verify?.data);
    if (verify?.data) {
      notifySuccess("OTP Verified!");
      setShowOTPModal(false);
      handleLogin();
    } else {
      notifyFailure("OTP could not be verified!");
    }
  };

  return (
    <main className="grid grid-cols-12 items-center my-8">
      <section className="col-start-2 col-span-6">
        <div className="mx-8 w-4/5 justify-self-center rounded-lg">
          <div className=" text-primary my-3 pt-2 pb-4 px-5 flex justify-between items-center">
            <h3 className="text-3xl font-bold">Create Account</h3>
            <small className="font-medium">
              Not a Doctor?{" "}
              <Link to="/patient/sign-up" className="font-bold">
                Sign Up
              </Link>
            </small>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6 px-5">
            <div className="grid grid-cols-12 gap-x-4 gap-y-0">
              {inputs?.map((input) => (
                <div className="col-span-6">
                  {input.type === "radio" ? (
                    <RadioInput
                      label={input?.label}
                      name={input?.name}
                      options={input?.options}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                    />
                  ) : input.type === "number" ? (
                    <PhoneInputComp
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                    />
                  ) : (
                    <InputField
                      label={input.label}
                      name={input.name}
                      type={input.type}
                      placeholder={input.placeholder}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mb-5">
              <small className="text-primary">
                <span className="font-bold">Note:</span>&nbsp;Password must be
                greater than 8 characters, with at least 1 uppercase letter, 1
                lowercase letter, 1 numeric character, and 1 special character.
                Avoid using palindromes.
              </small>
            </div>
            <div className="flex items-start justify-start my-2">
              <div className="flex items-center ms-4">
                <input
                  id="loggedIn"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="loggedIn"
                  className="ms-1 text-sm font-medium text-primary"
                >
                  Keep me logged in
                </label>
              </div>
            </div>
            <button className="form-btn my-3">Sign Up</button>
            <small className="block my-1 text-primary text-center">
              Already have an account?{" "}
              <Link to="/doctor/sign-in" className="font-bold">
                Log In
              </Link>
            </small>
          </form>
        </div>
      </section>
      <section className="col-span-4">
        <img src={image} alt="Doctors Image" className="w-full" />
      </section>
      <Toaster />
      <Modal
        title="Verify OTP"
        showModal={showOTPModal}
        setModal={setShowOTPModal}
      >
        <form
          onSubmit={handleSubmitModal(handleOTPSubmit)}
          className="pt-2 pb-3 px-5"
        >
          <p className="text-base font-medium text-primary mb-2">
            Enter OTP Received
          </p>
          <Controller
            name="otp"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <OTPInput
                {...field}
                numInputs={6}
                renderSeparator={<span>-</span>}
                containerStyle={{ gap: "10px" }}
                inputStyle={{
                  flex: 1,
                  border: "1px solid #ddd",
                  padding: "10px 0",
                  borderRadius: "7px",
                }}
                renderInput={(props) => <input {...props} />}
              />
            )}
          />
          {errorsModal["otp"] && (
            <small className="text-red-500 font-medium uppercase">
              {typeof errorsModal["otp"].message === "string" &&
                errorsModal["otp"].message}
            </small>
          )}
          <Button title="Verify Code" className="mt-4" />
          <Button
            title="Send Code Again"
            className="mt-2"
            type="button"
            onClick={sendOtp}
          />
          <small className="text-primary font-bold uppercase mt-4 block text-center">
            OTP will expire after 5 minutes!
          </small>
        </form>
      </Modal>
    </main>
  );
}
