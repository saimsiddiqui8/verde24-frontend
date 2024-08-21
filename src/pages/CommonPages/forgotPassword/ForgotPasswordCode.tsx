import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { verifyCode } from "./queriesAndUtils";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import OTPInput from "react-otp-input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  otp: z
    .string()
    .min(1, { message: "Otp is required!" })
    .length(6, { message: "Enter all six digits!" }),
});

const ForgotPasswordCode = () => {
  const {
    handleSubmit,
    control,
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

  const onSubmit = async (data: any) => {
    dispatch(loadingStart());
    const res = await verifyCode(data?.otp, state?.id, state?.for);
    dispatch(loadingEnd());
    if (res) {
      notifySuccess("Code Verified!");
      setTimeout(() => {
        navigate("/forgot-password/3", {
          state: { ...state },
        });
      }, 1000);
    } else {
      notifyFailure("Wrong Verification Code!");
    }
  };
  return (
<main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-4 md:mx-0 border border-primary rounded-lg bg-white shadow-lg">
        <div className="text-primary border-b border-primary pt-4 pb-6 px-6">
          <h3 className="text-2xl font-bold my-3">Forgot Password</h3>
          <small className="block text-sm text-gray-600">
            Please enter the code sent to your email address.
          </small>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-4 pb-6 px-6">
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
          {errors["otp"] && (
            <small className="block text-red-500 font-medium uppercase mt-2">
              {typeof errors["otp"].message === "string" &&
                errors["otp"].message}
            </small>
          )}
          <button
            type="submit"
            className="form-btn w-full py-2 mt-4"
          >
            Verify Code
          </button>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

export default ForgotPasswordCode;
