import image from "../../../assets/sign-in.png";
import { FacebookButton, GoogleButton, InputField } from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { PHARMACY_TOKEN_QUERY } from "./queries";
import { USER_ROLES } from "../../../api/roles";
import { setUser } from "../../../redux/slices/userSlice";
import { getPharmacyToken } from "../../../api/apiCalls/pharmacyApi";

const inputs = [
  {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    name: "email",
  },
  {
    label: "Password",
    type: "password",
    placeholder: "************",
    name: "password",
  },
];

const FormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function PharmacySignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data: Inputs) => {
    dispatch(loadingStart());
    const tokenRes = await getPharmacyToken(PHARMACY_TOKEN_QUERY, data);
    dispatch(loadingEnd());
    if (tokenRes?.token) {
      const userData = { ...tokenRes, role: USER_ROLES.pharmacy };
      dispatch(setUser(userData));
      notifySuccess("Login Success! Redirecting...");
      setTimeout(() => {
        navigate("/pharmacy-dashboard");
      }, 1000);
    } else {
      notifyFailure(tokenRes?.error || "Login Failed!");
      setError("email", { type: "custom" });
      setError("password", {
        type: "custom",
      });
    }
  };

  const onSubmit = async (data: any) => {
    handleLogin(data);
  };

  const handleGoogleSignIn = async () => {
    notifyFailure("Google Sign in is not available");
  };

  const handleFacebookSignIn = async () => {
    notifyFailure("Facebook Sign in is not available");
  };

  return (
    <main className="grid grid-cols-12 items-center gap-4 px-4 md:px-8">
      <section className="col-span-12 md:col-start-3 md:col-span-4 order-2 md:order-1">
        <div className="w-full justify-self-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-primary my-3 flex justify-between items-center">
              <h3 className="text-2xl md:text-3xl font-bold">Pharmacy Login</h3>
              <small className="font-medium">
                Are you a Lab?{" "}
                <Link to="/lab/sign-in" className="font-bold">
                  Sign In
                </Link>
              </small>
            </div>
            {inputs?.map((input, index) => (
              <InputField
                key={index}
                label={input.label}
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                properties={{ ...register(input.name) }}
                error={errors[input.name]}
              />
            ))}
            <div className="flex items-start justify-around my-2">
              <div className="flex items-center">
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
              <Link
                to="/forgot-password/1"
                state={{ for: "pharmacy" }}
                className="text-sm text-primary underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button className="form-btn my-3">Pharmacy Login</button>
          </form>
          <div className="flex items-center justify-between w-full my-2">
            <div className="w-1/2 md:w-[45%] h-[1px] bg-[#E0E0E0]"></div>
            <small>Or</small>
            <div className="w-1/2 md:w-[45%] h-[1px] bg-[#E0E0E0]"></div>
          </div>
          <GoogleButton
            label="Sign in with Google"
            onClick={handleGoogleSignIn}
          />
          <FacebookButton
            label="Sign in with Facebook"
            onClick={handleFacebookSignIn}
          />
          <small className="block my-1 text-primary text-center">
            Do not have an account?{" "}
            <Link to="/pharmacy/sign-up" className="font-bold">
              Sign Up
            </Link>
          </small>
        </div>
      </section>
      <section className="col-span-12 md:col-span-6 lg:col-span-4 order-1 md:order-2">
        <img src={image} alt="Pharmacy Image" className="w-full h-auto" />
      </section>
      <Toaster />
    </main>
  );
}

interface Inputs {
  email: string;
  password: string;
}
