export const LAB_TOKEN_QUERY = `
query LabToken($email: String!, $password: String!) {
  getLabToken(email: $email, password: $password){
    id,
    token,
    email,
    error
  }
}
`;
