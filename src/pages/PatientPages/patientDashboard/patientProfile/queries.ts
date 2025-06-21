export const FIND_PATIENT_QUERY = `
query($id: Int!) {
  findPatientById(id: $id) {
     id
    first_name
    last_name
     image
    email
    phone_number
    gender
    insurance_id
    age
    weight
    blood_group
    other_history
    wallet
  }
}
`;

export const UPDATE_PATIENT_QUERY = `
mutation UpdatePatient($updatePatientId: Int!, $data: PatientInputUpdate!) {
  updatePatient(id: $updatePatientId, data: $data) {
    first_name
    last_name
    image
    email
    phone_number
    gender
    insurance_id
    age
    weight
    blood_group
    other_history
  }
}
`;

export const GET_APPOINTMENT_BY_PATIENT_ID = `
query FindAppointmentByPatient($findAppointmentByPatientId: Int!) {
  findAppointmentByPatient(id: $findAppointmentByPatientId) {
    id
    appointment_date
    appointment_time
    patient_id
    doctor_id
    duration
    payment_id
    status
    meeting {
      id
      startTime
      googleMeetUrl
      appointmentsId
    }
    patient {
      first_name
      last_name
    }
    doctor {
      first_name
      last_name
    }
  }
}`;
export const GET_NEAREST_LABS = `
query FindNearestLabs($data: LabLocationData!) {
  findNearestLabs(data: $data) {
    id
    latitude
    longitude
    place_name
    distance
    duration
    logo
    name
    lab_name
    city
    registration_number
    email
    phone_number
    is_verified
    createdAt
  }
}`;

export const SEARCH_LABS_NAME = `
query SearchLabs($labName: String!) {
  searchLabs(lab_name: $labName) {
    id
    place_name
    lab_name
  }
}`;

export const SEARCH_LABS_TEST = `
query SearchLabTests($labTestName: String!) {
  searchLabTests(labTest_name: $labTestName) {
    lab_id
    title
  }
}`;

export const LAB_APPOINTMENT_BOOKING = `
mutation CreateLabAppointment($data: LabAppointmentInput!) {
  createLabAppointment(data: $data) {
    id
    lab_id
    appointment_date
    appointment_time
    appointment_weekday
    patient_name
    patient_age
    patient_phone_number
    patient_email
    patient_gender
    status
    patient_id
    payment_id
  }
}`;
export const DELETE_ALL_CARD = `
mutation DeleteAllItemsFromCart($patientId: Int!) {
  deleteAllItemsFromCart(patient_id: $patientId)
}`;

export const ADD_TO_CARD = `
mutation AddLabTestToCart($data: CartInput!) {
  addLabTestToCart(data: $data) {
    id
    patient_id
    labTest_id
    createdAt
    expiresAt
  }
}`;

export const CARD_BY_PATIENT_ID = `
query FindCartByPatientId($patientId: Int!) {
  findCartByPatientId(patient_id: $patientId) {
    id
    patient_id
    labTest_id
    labTest {
      title
      price
      description
      lab_id
    }
  }
}`;
export const DELETE_CARD = `
mutation DeleteItemFromCart($deleteItemFromCartId: Int!) {
  deleteItemFromCart(id: $deleteItemFromCartId) {
    id
    patient_id
    labTest_id
    createdAt
    expiresAt
  }
}`;
