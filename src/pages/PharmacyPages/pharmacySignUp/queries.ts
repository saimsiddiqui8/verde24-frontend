export const NEW_PHARMACY_QUERY = `
mutation CreatePharmacy($data: LabInput!) {
  createPharmacy(data: $data) {
    id
    name
    email
    phone_number
    is_verified
    createdAt
  }
}
`;

export const EXISTING_PHARMACY_QUERY = `
query FindPharmacyByEmail($email: String!) {
  findPharmacyByEmail(email: $email) {
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
