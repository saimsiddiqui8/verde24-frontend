export const DOCTOR_UPDATE_QUERY = `
mutation($id: String!, $data: DoctorInputUpdate!) {
    updateDoctor(id: $id, data: $data) {
      id
    }
  }
`;

export const GET_DOCTOR_QUERY = `
query($id:String!) {
  findDoctorById(id: $id) {
    id
    first_name
    last_name
    email
    phone_number
    gender
    is_verified
  }
}
`;
