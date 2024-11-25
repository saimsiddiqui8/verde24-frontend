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
