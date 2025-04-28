import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId =
  "302910868733-b5t5qph34riu6r7vr5kcrdned3pm0ih1.apps.googleusercontent.com";

const PatientGoogleAuth  = () => {
  const handleSuccess = async (response: any) => {
    const idToken = response.credential;
    return idToken
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </GoogleOAuthProvider>
  );
};

export default PatientGoogleAuth ;
