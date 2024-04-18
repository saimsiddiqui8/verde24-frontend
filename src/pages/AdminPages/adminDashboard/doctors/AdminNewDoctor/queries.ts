export const DOCTORS_QUERY = `
mutation($data: DoctorInput!) {
  createDoctor(data: $data) {
    email
  }
}
`;
