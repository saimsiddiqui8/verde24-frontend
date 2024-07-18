export const DOCTOR_TOKEN_QUERY = `
query DoctorToken($email: String!, $password: String!) {
  getDoctorToken(email: $email, password: $password){
    id,
    token,
    email,
    error
  }
}
`;
