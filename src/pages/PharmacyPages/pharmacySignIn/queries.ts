export const PHARMACY_TOKEN_QUERY = `
query GetPharmacyToken($email: String!, $password: String!) {
  getPharmacyToken(email: $email, password: $password) {
    id,
    token,
    email,
    error,
  }
}
`;
