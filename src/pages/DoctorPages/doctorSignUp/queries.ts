export const NEW_DOCTOR_QUERY = `
mutation($data: DoctorInput!) {
  createDoctor(data: $data) {
    email,
    error
  }
}
`;

export const EXISTING_DOCTOR_QUERY = `
query($email: String!) {
findDoctorByEmail(email: $email) {
  id
}
}
`;

export const SEND_OTP_QUERY = `
mutation($email: String!,$role: String!) {
createUserOtp(email: $email,role: $role) {
  id
}
}
`;

export const VERIFY_OTP_QUERY = `
query ($email: String!,$role: String!, $code: String!) {
verifyUserOtp(email: $email,role: $role,code: $code)
}
`;
