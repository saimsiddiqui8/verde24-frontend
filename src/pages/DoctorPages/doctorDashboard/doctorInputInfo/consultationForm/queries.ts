export const DOCTOR_UPDATE_QUERY = `
mutation Mutation($updateDoctorId: Int!, $data: DoctorInputUpdate!) {
  updateDoctor(id: $updateDoctorId, data: $data) {
  id
    online
    first_name
    last_name
    email
    phone_number
    gender
    is_verified
    verification_code
    verification_code_expiry
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
    booking_lead_time
    payout_method
    payout_method_id
    address
    postal_code
    services
    specialization
    bibliography
  }
}
`;

export const GET_DOCTOR_QUERY = `
query FindDoctorById($findDoctorByIdId: Int!) {
  findDoctorById(id: $findDoctorByIdId) {
    id
    online
    first_name
    last_name
    email
    phone_number
    gender
    password
    is_verified
    verification_code
    verification_code_expiry
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
    booking_lead_time
    payout_method
    payout_method_id
    address
    postal_code
    services
    specialization
    bibliography
  }
}
`;

export const GET_DOCTOR_QUERY = `
query FindDoctorById($findDoctorByIdId: Int!) {
  findDoctorById(id: $findDoctorByIdId) {
    id
    online
    first_name
    last_name
    email
    phone_number
    gender
    password
    is_verified
    verification_code
    verification_code_expiry
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
    booking_lead_time
    payout_method
    payout_method_id
    address
    postal_code
    services
    specialization
    bibliography
  }
}
`;
