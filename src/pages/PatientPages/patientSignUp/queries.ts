export const NEW_PATIENT_QUERY = `
mutation($data: PatientInput!) {
  createPatient(data: $data) {
    email
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

export const CREATE_PATIENT_WITH_GOOGLE = `
mutation CreatePatientWithGoogle($data: PatientGoogleSignUpInput!) {
  createPatientWithGoogle(data: $data) {
    email
    error
  }
}`
export const LOGIN_PATIENT_WITH_GOOGLE = `
mutation LoginPatientWithGoogle($data: String!) {
  loginPatientWithGoogle(data: $data) {
    id
    token
    email
    is_verified
    error
  }
}`
