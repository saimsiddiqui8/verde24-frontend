export const DOCTOR_QUERY = `
query {
  doctors {
    id,
    first_name,
    last_name,
    is_verified
  }
}
`;
