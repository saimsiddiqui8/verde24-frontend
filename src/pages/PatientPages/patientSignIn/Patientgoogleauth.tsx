import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const clientId = "302910868733-b5t5qph34riu6r7vr5kcrdned3pm0ih1.apps.googleusercontent.com";

const Patientgoogleauth = () => {
  const handleSuccess = async (response : any) => {
    const idToken = response.credential;

    console.log("Login Success:", idToken);
    // try {
    //   const { data } = await axios.post("http://localhost:5000/auth/google", { idToken });
    //   console.log("Login Success:", data);
    //   localStorage.setItem("token", data.token);
    // } catch (error) {
    //   console.error("Login Failed:", error);
    // }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
    </GoogleOAuthProvider>
  );
};

export default Patientgoogleauth;