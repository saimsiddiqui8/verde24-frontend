import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";
import { useMutation } from "react-query";
import { LOGIN_PATIENT_WITH_GOOGLE } from "../patientSignUp/queries";
import { loginPatientWithGoogle } from "../../../api/apiCalls/patientsApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { USER_ROLES } from "../../../api/roles";
import { setUser } from "../../../redux/slices/userSlice";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const clientId =
  "1094401600784-kpaksqm0iefum9p9u2en5t82u044tdei.apps.googleusercontent.com";

const PatientGoogleAuth = () => {
  const { setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createPatient = async (data: string) => {
    const response = await loginPatientWithGoogle(LOGIN_PATIENT_WITH_GOOGLE, {
      data,
    });
    return response;
  };

  const { mutate, isLoading } = useMutation(createPatient, {
    onSuccess: (tokenRes) => {
      const userData = {
        ...tokenRes,
        role: USER_ROLES.patient,
        latitude: getValues("latitude"),
        longitude: getValues("longitude"),
      };

      dispatch(setUser(userData));
      notifySuccess("Login Success.");
      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 1000);
    },
    onError: (error: Error) => {
      notifyFailure(error.message || "❌ Login failed.");
    },
  });

  // 👇 get location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", parseFloat(position.coords.latitude.toString()));
        setValue("longitude", parseFloat(position.coords.longitude.toString()));
      },
      (error) => {
        notifyFailure(
          "Location access denied. Please enable it in browser settings. " +
            error.message,
        );
      },
    );
  }, []);

  const handleSuccess = (response: CredentialResponse) => {
    const idToken = response.credential;
    if (idToken) {
      mutate(idToken);
    } else {
      notifyFailure("No token received from Google");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => notifyFailure("❌ Google Login Failed")}
        useOneTap
      />
      {isLoading && <p>Logging in...</p>}
    </GoogleOAuthProvider>
  );
};

export default PatientGoogleAuth;
