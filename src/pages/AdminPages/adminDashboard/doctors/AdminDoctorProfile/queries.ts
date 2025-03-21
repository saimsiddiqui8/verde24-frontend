export const HOSPITAL_QUERY = `
query {
  hospitals {
    id,
    name,
  }
}
`;

export const DOCTOR_QUERY = `
query FindDoctorById($findDoctorByIdId: Int!) {
  findDoctorById(id: $findDoctorByIdId) {
    id
    first_name
    last_name
    email
    phone_number
    gender
    is_verified
    form_submitted
    image
    city
    country
    department
    experience
    registration_no
    qualification
    consultation_mode
    consultation_fee_regular
    consultation_fee_discounted
    payout_method_id
    address
    postal_code
    services
    specialization
    bibliography
    work
    degree
    designation
    enterSymptom
    institute
    ac_no
    upi_id
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
mutation($id: Int!, $data: DoctorInputUpdate!) {
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
