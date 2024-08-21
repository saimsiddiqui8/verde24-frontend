import image from "../../../assets/sign-up.png";
import { useEffect, useState } from "react";
import {
  Button,
  InputField,
  Modal,
  PhoneInputComp,
} from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  isPhoneValid,
  notifyFailure,
  notifySuccess,
} from "../../../utils/Utils";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OTPInput from "react-otp-input";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { EXISTING_PHARMACY_QUERY, NEW_PHARMACY_QUERY, SEND_OTP_QUERY, VERIFY_OTP_QUERY } from "./queries";
import { createPharmacy, findPharmacyByEmail, sendPharmacyOTP, verifyPharmacyOTP } from "../../../api/apiCalls/pharmacyApi";
import { useDispatch } from "react-redux";
import { useMutation, useQuery } from "react-query";

const inputs = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Your Name",
    name: "name",
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
    label: "Password",
    type: "password",
    placeholder: "************",
    name: "password",
    error: false,
  },
];

const UserSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email(),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(9, { message: "Password is too short" })
      .regex(/[A-Z]/, { message: "Please include an uppercase letter" })
      .regex(/[a-z]/, { message: "Please include a lowercase letter" })
      .regex(/\d/, {
        message: "Please include at least one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Please include at least one special character",
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

export default function PharmacySignUp() {

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
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

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createNewPharmacy = async (data: any) => {
    return createPharmacy(NEW_PHARMACY_QUERY, { data });
  };

  const checkDuplicateEmail = async () => {
    return findPharmacyByEmail(EXISTING_PHARMACY_QUERY, {
      email: getValues("email"),
    });
  };

  const sendOTP = async () => {
    return sendPharmacyOTP(SEND_OTP_QUERY, {
      email: getValues("email"),
      role: "pharmacy",
    });
  };
  const pharmacyEmail = useQuery({
    queryFn: checkDuplicateEmail,
    enabled: false,
  });
  const verifyOTP = async () => {
    return verifyPharmacyOTP(VERIFY_OTP_QUERY, {
      email: getValues("email"),
      role: "pharmacy",
      code: getValuesModal("otp"),
    });
  };

  const { data, mutate } = useMutation(createNewPharmacy);

  const verifyOTPData = useQuery({
    queryFn: verifyOTP,
    enabled: false,
  });
  const pharmacyOTPData = useQuery({
    queryFn: sendOTP,
    enabled: false,
  });
  const sendOtp = async () => {
    dispatch(loadingStart());
    const otp = await pharmacyOTPData.refetch();
    if (otp?.status === "success") {
      notifySuccess("OTP is sent to your email. Please Verify!");
      setShowOTPModal(true);
    }
    dispatch(loadingEnd());
  };
  const handleValidation = async () => {
    dispatch(loadingStart());
    const email = await pharmacyEmail.refetch();
    if (email?.data?.id) {
      setError("email", { message: "Email Already Exists!" });
      dispatch(loadingEnd());
    } else {
      await sendOtp();
    }
  };


  const onSubmit = async () => {
    handleValidation();
  };

  const handleModalSubmit = async () => {
    handleValidation();
  };

  const handleOTPSubmit = async () => {
    dispatch(loadingStart());
    const verify = await verifyOTPData.refetch();
    console.log(verify)
    dispatch(loadingEnd());
    if (verify?.status === "success") {
      notifySuccess("OTP Verified!");
      setShowOTPModal(false);
      handleLogin();
    } else {
      notifyFailure("OTP could not be verified!");
    }
  };
  const handleLogin = () => {
    dispatch(loadingStart());
    mutate(getValues());
  };
  useEffect(() => {
    if (data) {
      reset();
      if (data?.email) {
        notifySuccess("Sign Up Success.");
        setTimeout(() => {
          navigate("/pharmacy/sign-in");
        }, 1000);
      } else {
        notifyFailure(data?.error || "Sign Up Failure");
      }
      dispatch(loadingEnd());
    }
  }, [data]);

  return (
    <main className="grid grid-cols-1 mb-4 md:grid-cols-12 items-center p-4">
      <section className="col-span-1 md:col-start-2 md:col-span-5 order-2 md:order-1">
        <div className="justify-self-center w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-primary my-3 flex flex-col md:flex-row justify-between items-center">
              <h3 className="text-3xl font-bold">Create Account</h3>
              <small className="font-medium mt-2 md:mt-0">
                Are you a Lab?{" "}
                <Link to="/lab/sign-up" className="font-bold">
                  Sign Up
                </Link>
              </small>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {inputs?.map((input, index) => (
                <div key={index} className="col-span-1">
                  {input.type === "number" ? (
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
            <button className="form-btn my-3 w-full ">Sign Up</button>
          </form>
          <div className="flex items-center justify-between w-full my-2">
            <div className="w-[45%] h-[1px] bg-[#E0E0E0]"></div>
            <small>Or</small>
            <div className="w-[45%] h-[1px] bg-[#E0E0E0]"></div>
          </div>
          <small className="block my-1 text-primary text-center">
            Already have an account?{" "}
            <Link to="/pharmacy/sign-in" className="font-bold">
              Log in
            </Link>
          </small>
        </div>
      </section>
      <section className="col-span-1 md:col-span-4 px-4 order-1 md:order-2">
        <img src={image} alt="Pharmacy Image" className="w-full h-auto" />
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
            onClick={() => notifyFailure("Send OTP is not available")}
          />
          <small className="text-primary font-bold uppercase mt-4 block text-center">
            OTP will expire after 5 minutes!
          </small>
        </form>
      </Modal>
      <Modal
        title="Enter Following Information"
        showModal={showSignupModal}
        setModal={setShowSignupModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit(handleModalSubmit)}>
          <PhoneInputComp
            value={getValues("phone_number")}
            onChange={(e) => setValue("phone_number", e)}
            properties={{ ...register("phone_number") }}
            error={errors?.phone_number}
          />
          <button type="submit" className="form-btn">
            Sign Up
          </button>
        </form>
      </Modal>
    </main>
  );
}
