import { useLocation, useNavigate } from "react-router-dom";
import { InputField } from "../../../components";
import { useEffect } from "react";
import { updatePassword, users } from "./queriesAndUtils";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z
  .object({
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
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

const ForgotPasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!state?.for) {
      navigate(-1);
    }
  }, [state?.for]);

  const handleNavigate = () => {
    if (state?.for === users.patient) {
      navigate("/patient/sign-in");
    } else if (state?.for === users.doctor) {
      navigate("/doctor/sign-in");
    } else if (state?.for === users.admin) {
      navigate("/admin/sign-in");
    }
  };

  const onSubmit = async (data: any) => {
    dispatch(loadingStart());
    const res = await updatePassword(
      state?.id.toString(),
      state?.for,
      data?.password
    );
    dispatch(loadingEnd());
    if (res?.id) {
      notifySuccess("Password Changed Successfully!");
      setTimeout(() => handleNavigate(), 1000);
    } else {
      notifyFailure("Password Change Unsuccessful!");
    }
  };
  return (
    <main>
      <div className="mx-auto mt-12 w-2/5 justify-self-center border border-primary rounded-lg">
        <div className="text-primary border-b border-primary pt-2 pb-4 px-5">
          <h3 className="text-2xl font-bold my-3">Forgot Password</h3>
          <small>
            Please enter the email address you would like your password
            information sent to{" "}
          </small>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6 px-5">
          <InputField
            label="New Password"
            name="password"
            type="password"
            properties={{ ...register("password") }}
            error={errors["password"]}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            properties={{ ...register("confirmPassword") }}
            error={errors["confirmPassword"]}
          />
          <div className="mb-5">
            <small className="text-primary">
              <span className="font-bold">Note:</span>&nbsp;Password must be
              greater than 8 characters, with at least 1 uppercase letter, 1
              lowercase letter, 1 numeric character, and 1 special character.
              Avoid using palindromes.
            </small>
          </div>
          <button className="form-btn my-3">Reset Password</button>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

export default ForgotPasswordReset;
