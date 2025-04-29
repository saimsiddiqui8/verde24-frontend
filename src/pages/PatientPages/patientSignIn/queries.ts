export const PATIENT_TOKEN_QUERY = `
query GetPatientToken($email: String!, $password: String!, $latitude: Float!, $longitude: Float!) {
  getPatientToken(email: $email, password: $password, latitude: $latitude, longitude: $longitude) {
    id
    token
    email
    is_verified
    error
  }
}
`;
