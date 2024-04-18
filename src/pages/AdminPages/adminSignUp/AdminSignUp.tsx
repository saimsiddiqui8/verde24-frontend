import image from "../../../assets/form-img.png";
import { useState, useEffect } from "react";
import { InputField } from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Toaster } from "react-hot-toast";
import { publicRequest } from "../../../api/requestMethods";
import {
  PasswordCheckType,
  isValidPassword,
  notifyFailure,
  notifySuccess,
} from "../../../utils/Utils";

const inputs = [
  {
    label: "First Name",
    type: "text",
    placeholder: "Enter Your First Name",
    name: "first_name",
  },
  {
    label: "Last Name",
    type: "text",
    placeholder: "Enter Your Last Name",
    name: "last_name",
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
    name: "email",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
  },
  {
    label: "Password",
    type: "password",
    placeholder: "************",
    name: "password",
  },
];

export default function AdminSignUp() {
  const [inputValues, setInputValues] = useState<any>({});
  const navigate = useNavigate();
  const ADMIN_QUERY = `
  mutation($data: AdminInput!) {
    createAdmin(data: $data) {
      email
    }
  }
`;

  const createAdmin = async (data: any) => {
    return publicRequest
      .post("/graphql", {
        query: ADMIN_QUERY,
        variables: { data },
      })
      .then((response) => response.data.data.createAdmin);
  };

  const { mutate, isSuccess, data } = useMutation(createAdmin);

  const handleChange = (e: any) => {
    setInputValues((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (Object.keys(inputValues).length === 5) {
      const passwordCheck: PasswordCheckType = isValidPassword(
        inputValues?.password
      );
      if (passwordCheck?.status) {
        mutate(inputValues);
      } else {
        notifyFailure(passwordCheck?.msg);
      }
    } else {
      notifyFailure("Please fill all fields!");
    }
  };
  useEffect(() => {
    if (data) {
      if (isSuccess) {
        notifySuccess("Sign up successful!");
        setTimeout(() => {
          navigate("/admin/sign-in");
        }, 1000);
      } else {
        notifyFailure("Sign up unsuccessful!");
      }
    }
  }, [data]);

  return (
    <main className="grid grid-cols-12 items-center my-12">
      <section className="col-start-3 col-span-4">
        <img src={image} alt="Doctors Image" className="w-full" />
      </section>
      <section className="col-span-6">
        <div className="mx-8 w-4/5 justify-self-center border border-primary rounded-lg">
          <h3 className="text-2xl text-primary font-bold my-3 border-b border-primary pt-2 pb-4 px-5">
            Admin Sign Up
          </h3>
          <form onSubmit={handleSubmit} className="pt-2 pb-6 px-5">
            <div className="grid grid-cols-12 gap-x-4 gap-y-0">
              {inputs?.map((input) => (
                <div className="col-span-6">
                  <InputField
                    label={input.label}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
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
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-1 text-sm font-medium text-primary">
                  Keep me logged in
                </label>
              </div>
            </div>
            <button className="form-btn my-3">Sign Up</button>
            <small className="block my-1 text-primary text-center">
              Already have an account?{" "}
              <Link to="/admin/sign-in" className="font-bold">
                Log In
              </Link>
            </small>
          </form>
        </div>
      </section>
      <Toaster />
    </main>
  );
}
