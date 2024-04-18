export const EXISTING_PATIENT_QUERY = `
query($email: String!) {
findPatientByEmail(email: $email) {
  id
}
}
`;

export const GET_PATIENT_QUERY = `
query($id:String!) {
  findPatientById(id: $id) {
    id,
    first_name,
    last_name,
    email,
    phone_number,
    gender,
    is_verified
  }
}
`;

export const UPDATE_PATIENT_QUERY = `
mutation($id: String!,$data: PatientInputUpdate!) {
  updatePatient(id:$id,data: $data) {
    email
  }
}
`;
