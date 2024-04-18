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
  }, [state?.for]);

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
            label="Email Address"
            name="email"
            type="email"
            properties={{ ...register("email") }}
            error={errors["email"]}
          />
          <button className="form-btn my-3">Send Email</button>
          <Link to="/">
            <button className="form-btn my-3">Back to Login</button>
          </Link>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

export default ForgotPasswordEmail;
