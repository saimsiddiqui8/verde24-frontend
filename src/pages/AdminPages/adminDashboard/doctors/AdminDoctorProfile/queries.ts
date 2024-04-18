export const HOSPITAL_QUERY = `
query {
  hospitals {
    id,
    name,
  }
}
`;

export const DOCTOR_QUERY = `
query($id:String!) {
  findDoctorById(id: $id) {
    id
    first_name
    last_name
    email
    phone_number
    gender
    is_verified
    doctorHospitals{
      hospital_id
    }
  }
}
`;

export const DOCTOR_HOSPITAL_QUERY = `
query($id: String!) {
getDoctorHospitals(id: $id) {
  id
}
}
`;

export const DOCTOR_UPDATE_QUERY = `
mutation($id: String!, $data: DoctorInputUpdate!) {
    updateDoctor(id: $id, data: $data) {
      id
    }
  }
`;

export const DOCTOR_ADD_HOSPITAL_QUERY = `
mutation($data: DoctorHospitalInput!) {
  createDoctorHospital(data: $data) {
    id
  }
}
`;

export const DOCTOR_REMOVE_HOSPITAL_QUERY = `
mutation ($data: DoctorHospitalInput!) {
  removeDoctorHospital(data: $data) {
    id
  }
}
`;
