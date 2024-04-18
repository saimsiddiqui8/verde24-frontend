export const HOSPITAL_QUERY = `
mutation($data: HospitalInput!) {
  createHospital(data: $data) {
    id
  }
}
`;
