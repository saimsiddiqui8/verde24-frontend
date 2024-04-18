export const PATIENT_TOKEN_QUERY = `
query PatientToken($email: String!, $password: String!) {
  getPatientToken(email: $email, password: $password){
    id,
    token,
    email,
    error
  }
}
`;
