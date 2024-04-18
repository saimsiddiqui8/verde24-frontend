import image from "../../../assets/sign-in.png";
import { FacebookButton, GoogleButton, InputField } from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { googleSignIn, facebookSignIn } from "../../../firebase/utils";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";
import { USER_ROLES } from "../../../api/roles";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { users } from "../../CommonPages/forgotPassword/queriesAndUtils";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPatientToken } from "../../../api/apiCalls/patientsApi";
import { PATIENT_TOKEN_QUERY } from "./queries";

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

export default function PatientSignIn() {
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
    const tokenRes = await getPatientToken(PATIENT_TOKEN_QUERY, data);
    dispatch(loadingEnd());
    if (tokenRes?.token) {
      const userData = { ...tokenRes, role: USER_ROLES.patient };
      dispatch(setUser(userData));
      notifySuccess("Login Success! Redirecting...");
      setTimeout(() => {
        navigate("/patient-dashboard");
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

  const handleUser = (userData: any) => {
    if (userData?.accessToken) {
      const user = { email: userData?.email, password: userData?.uid };
      handleLogin(user);
    } else {
      notifyFailure("Login Failed!");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userData = await googleSignIn();
      handleUser(userData);
    } catch (err) {
      notifyFailure("Google Sign in Error!");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const userData = await facebookSignIn();
      handleUser(userData);
    } catch (err) {
      notifyFailure("Facebook Sign in Error!");
    }
  };

  return (
    <main className="grid grid-cols-12 items-center">
      <section className="col-start-3 col-span-4">
        <div className="w-11/12 justify-self-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-primary my-3 flex justify-between items-center">
              <h3 className="text-3xl font-bold">Log In</h3>
              <small className="font-medium">
                Are you a Doctor?{" "}
                <Link to="/doctor/sign-in" className="font-bold">
                  Sign In
                </Link>
              </small>
            </div>
            {inputs?.map((input) => (
              <InputField
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
                state={{ for: users.patient }}
                className="text-sm text-primary underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button className="form-btn my-3">Log In</button>
          </form>
          <div className="flex items-center justify-between w-full my-2">
            <div className="w-[45%] h-[1px] bg-[#E0E0E0]"></div>
            <small>Or</small>
            <div className="w-[45%] h-[1px] bg-[#E0E0E0]"></div>
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
            <Link to="/patient/sign-up" className="font-bold">
              Sign Up
            </Link>
          </small>
        </div>
      </section>
      <section className="col-span-4">
        <img src={image} alt="Doctors Image" className="w-full" />
      </section>
      <Toaster />
    </main>
  );
}

interface Inputs {
  email: string;
  password: string;
}
