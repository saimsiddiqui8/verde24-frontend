export const FIND_PATIENT_QUERY = `
query($id:String!) {
  findPatientById(id: $id) {
    first_name,
    last_name,
    phone_number,
    gender,
    insurance_id,
    age,
    weight,
    blood_group,
    other_history
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
