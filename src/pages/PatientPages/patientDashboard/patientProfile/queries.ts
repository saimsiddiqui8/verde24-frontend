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
mutation UpdatePatient($data: PatientInputUpdate!, $updatePatientId: String!) {
  updatePatient(data: $data, id: $updatePatientId) {
    email
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
