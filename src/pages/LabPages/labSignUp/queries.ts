export const NEW_LAB_QUERY = `
mutation($data: LabInput!) {
  createLab(data: $data) {
    email
  }
}
`;

export const EXISTING_LAB_QUERY = `
query($email: String!) {
findLabByEmail(email: $email) {
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
