import { useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { PhoneInputComp, RadioInput } from "../../../components";
import { isPhoneValid, notifyFailure, notifySuccess } from "../../../utils/Utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import { CREATE_PATIENT_WITH_GOOGLE } from "../patientSignUp/queries";
import { createPatientWithGoogle } from "../../../api/apiCalls/patientsApi";
import { useNavigate } from "react-router-dom";


const clientId =
  "1094401600784-kpaksqm0iefum9p9u2en5t82u044tdei.apps.googleusercontent.com";

const inputFields = [
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
    error: false,
  },
  {
    label: "Gender",
    type: "radio",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
    error: false,
  },
];

const UserSchema = z.object({
  phone_number: z
    .string()
    .min(1, { message: "Phone Number is required" })
    .refine((val) => isPhoneValid(val), {
      message: "Invalid Phone Number",
    }),
  gender: z.string().min(1, { message: "Gender is required" }),
  idToken: z.string().min(1, { message: "Google token is missing" }),
  latitude: z.number({ invalid_type_error: "Latitude is required" }),
  longitude: z.number({ invalid_type_error: "Longitude is required" }),
});

type UserFormType = z.infer<typeof UserSchema>;

const PatientGoogleSignup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
    phone_number: "",
    gender: "",
    idToken: "", 
    latitude: 0,
    longitude: 0,
  },
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      notifyFailure("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude);
        setValue("longitude", position.coords.longitude);
      },
      (error) => {
        notifyFailure(
          "Location access denied. Please enable it in browser settings. " +
            error.message
        );
      }
    );
  };

  const handleSuccess = (response: CredentialResponse) => {
    const idToken = response.credential;
    if (idToken) {
      setValue("idToken", idToken);
      getLocation(); 
      setShowPopup(true);
    }
  };

  const createPatient = async (data: UserFormType) => {
      const response = await createPatientWithGoogle(CREATE_PATIENT_WITH_GOOGLE, { data });
      return response;
    };

  const { mutate } = useMutation(createPatient, {
  onSuccess: () => {
     notifySuccess("Sign Up Success.");
        setTimeout(() => {
          navigate("/patient/sign-in");
        }, 1000);
  },
  onError: (error: Error) => {
    const errorMessage =
      error?.message || "❌ Failed to create patient.";
    notifyFailure(errorMessage);
  },
});

  const onSubmit = (data: UserFormType) => {
    const authData = {
      phone_number: data.phone_number,
      gender: data.gender,
      idToken: data.idToken,
      latitude: data.latitude,
      longitude: data.longitude,
    }
    mutate(authData)
    setShowPopup(false);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => notifyFailure("❌ Google Login Failed")}
      />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Complete Your Details
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {inputFields.map((input) => (
                <div key={input.name} className="mb-4">
                  {input.type === "radio" ? (
                    <RadioInput
                      className="my-0"
                      label={input.label}
                      name={input.name}
                      options={input.options}
                      properties={{ ...register(input.name as keyof UserFormType) }}
                      error={errors[input.name as keyof UserFormType]}
                    />
                  ) : input.type === "number" ? (
                    <PhoneInputComp
                      className="my-4"
                      properties={{ ...register(input.name as keyof UserFormType) }}
                      error={errors[input.name as keyof UserFormType]}
                    />
                  ) : null}
                </div>
              ))}
              {/* Hidden Inputs */}
              <input type="hidden" {...register("idToken")} />
              <input type="hidden" {...register("latitude")} />
              <input type="hidden" {...register("longitude")} />

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </GoogleOAuthProvider>
  );
};

export default PatientGoogleSignup;
