export const FIND_PATIENT_QUERY = `
query($id: Int!) {
  findPatientById(id: $id) {
     id
    first_name
    last_name
    email
    phone_number
    gender
    password
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
mutation UpdatePatient($data: PatientInputUpdate!, $updatePatientId: Int!) {
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
    labTest_id
    payment_id
  }
}`;
