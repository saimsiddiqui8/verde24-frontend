import image from "../../../assets/form-img.png";
import { InputField } from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { publicRequest } from "../../../api/requestMethods";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";
import { USER_ROLES } from "../../../api/roles";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { users } from "../../CommonPages/forgotPassword/queriesAndUtils";
import { loadingEnd, loadingStart } from "../../../redux/slices/loadingSlice";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormInputs {
  email: string;
  password: string;
}


const inputs: Array<{
  label: string;
  type: string;
  placeholder: string;
  name: keyof FormInputs;
  error: boolean
}> = [
    {
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      name: "email",
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

const ADMIN_QUERY = `
query AdminToken($email: String!, $password: String!) {
  getAdminToken(email: $email, password: $password){
    token,
    email,
    error
  }
}
`;

const FormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" }),
});


export default function In() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: zodResolver(FormSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAdminToken = async (data: FormInputs) => {
    const response = await publicRequest.post("/graphql", {
      query: ADMIN_QUERY,
      variables: data,
    });
    return response.data.data.getAdminToken;
  };

  const handleLogin = async (data: FormInputs) => {
    dispatch(loadingStart());
    const tokenRes = await getAdminToken(data);
    dispatch(loadingEnd());
    if (tokenRes?.token) {
      const userData = { ...tokenRes, role: USER_ROLES.admin };
      dispatch(setUser(userData));
      notifySuccess("Login Success! Redirecting...");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);
    } else {
      notifyFailure(tokenRes?.error || "Login Failed!");
      setError("email", { type: "custom" });
      setError("password", {
        type: "custom",
      });
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    handleLogin(data);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-12 items-center my-12">
      <section className="md:col-start-3 md:col-span-4 col-span-1 p-4">
        <img src={image} alt="Doctors Image" className="w-full" />
      </section>
      <section className="md:col-span-5 col-span-1">
        <div className="mx-4 md:mx-8 w-full md:w-4/5 justify-self-center border border-primary rounded-lg">
          <h3 className="text-2xl text-primary font-bold my-3 border-b border-primary pt-2 pb-4 px-5">
            Admin
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6 px-5">
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
                state={{ for: users.admin }}
                className="text-sm text-primary underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button className="form-btn my-3">Log In</button>
          </form>
        </div>
      </section>
      <Toaster />
    </main>

  );
}
