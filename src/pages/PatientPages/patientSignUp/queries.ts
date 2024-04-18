export const NEW_PATIENT_QUERY = `
mutation($data: PatientInput!) {
  createPatient(data: $data) {
    email,
    error
  }
}
`;

export const EXISTING_PATIENT_QUERY = `
query($email: String!) {
findPatientByEmail(email: $email) {
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
