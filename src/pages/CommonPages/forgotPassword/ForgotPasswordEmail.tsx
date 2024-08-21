import { Link, useLocation, useNavigate } from "react-router-dom";
import { InputField } from "../../../components";
import { useEffect } from "react";
import {
  forgotPassword,
  getAdminByEmail,
  getDoctorByEmail,
  getPatientByEmail,
  users,
} from "./queriesAndUtils";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  email: z.string().min(1, { message: "Email is required!" }).email(),
});

const ForgotPasswordEmail = () => {
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
  }, [state?.for, navigate]);

  const sendEmail = async (email: string, id: number) => {
    const res = await forgotPassword(email, id, state?.for);
    dispatch(loadingEnd());
    console.log(res);
    if (res?.id) {
      notifySuccess("Verification Code is sent to your email. Redirecting...");
      setTimeout(() => {
        navigate("/forgot-password/2", { state: { for: state?.for, id } });
      }, 1000);
    } else {
      notifyFailure("We couldn't send Verification Code to your email.");
    }
  };

  const onSubmit = async (data: any) => {
    if (data?.email?.length > 0) {
      dispatch(loadingStart());
      if (state?.for === users.patient) {
        const res = await getPatientByEmail(data?.email);
        if (res?.id) {
          sendEmail(data?.email, parseInt(res.id));
        } else {
          dispatch(loadingEnd());
          notifyFailure("This email does not exist!");
        }
      } else if (state?.for === users.doctor) {
        const res = await getDoctorByEmail(data?.email);
        if (res?.id) {
          sendEmail(data?.email, parseInt(res.id));
        } else {
          dispatch(loadingEnd());
          notifyFailure("This email does not exist!");
        }
      } else if (state?.for === users.admin) {
        const res = await getAdminByEmail(data?.email);
        if (res?.id) {
          sendEmail(data?.email, parseInt(res.id));
        } else {
          dispatch(loadingEnd());
          notifyFailure("This email does not exist!");
        }
      }
    } else {
      notifyFailure("Please Enter an email address!");
    }
  };
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md mx-4 md:mx-0 border border-primary rounded-lg bg-white shadow-lg">
      <div className="text-primary border-b border-primary pt-4 pb-6 px-6">
        <h3 className="text-2xl font-bold my-3">Forgot Password</h3>
        <small className="block text-sm text-gray-600">
          Please enter the email address you would like your password information sent to.
        </small>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-4 pb-6 px-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          properties={{ ...register("email") }}
          error={errors["email"]}
        />
        <button type="submit" className="form-btn w-full mt-4 py-2">Send Email</button>
        <Link to="/" className="block mt-4 text-center">
          <button type="button" className="form-btn w-full py-2">Back to Login</button>
        </Link>
      </form>
    </div>
    <Toaster />
  </main>
  );
};

export default ForgotPasswordEmail;
