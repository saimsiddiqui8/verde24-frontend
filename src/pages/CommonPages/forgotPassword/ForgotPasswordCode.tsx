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
  }, [state?.for]);

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
    <main>
      <div className="mx-auto mt-12 w-2/5 justify-self-center border border-primary rounded-lg">
        <div className="text-primary border-b border-primary pt-2 pb-4 px-5">
          <h3 className="text-2xl font-bold my-3">Forgot Password</h3>
          <small>Please enter the code sent to your email address</small>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6 px-5">
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
            <small className="text-red-500 font-medium uppercase">
              {typeof errors["otp"].message === "string" &&
                errors["otp"].message}
            </small>
          )}
          <button className="form-btn my-3">Verify Code</button>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

export default ForgotPasswordCode;
