export const DOCTOR_UPDATE_QUERY = `
mutation Mutation($updateDoctorId: Int!, $data: DoctorInputUpdate!) {
  updateDoctor(id: $updateDoctorId, data: $data) {
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

export const GET_DOCTOR_QUERY = `
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

export const GET_DOCTOR_TIMESLOTS = `
query FindDoctorTimeSlots($findDoctorTimeSlotsId: Int!) {
  findDoctorTimeSlots(id: $findDoctorTimeSlotsId) {
    id
    doctor_id
    weekday
    error
    timeSlots {
      id
      doctorTimeSlotId
      time
      status
    }
  }
}`;

export const CREATE_PAYMENT = `
mutation CreatePayment($data: PaymentInput!) {
  createPayment(data: $data) {
    message
    payment {
      id
      amount
      payment_date
      is_paid
    } 
  }
}
  `;

export const ADD_SLOTS_QUERY = `mutation Mutation($data: DoctorTimeSlotInput!) {
  createDoctorTimeSlots(data: $data) {
    id
    doctor_id
    weekday
    error
    timeSlots {
      id
      doctorTimeSlotId
      time
      status
    }
  }
}`;

export const DELETE_TIME_SLOTS = `
mutation DeleteDoctorTimeSlots($deleteDoctorTimeSlotsId: Int!) {
  deleteDoctorTimeSlots(id: $deleteDoctorTimeSlotsId) {
    id
    doctor_id
    weekday
    error
    timeSlots {
      id
      doctorTimeSlotId
      time
      status
    }
  }
}`;

export const UPDATE_TIME_SLOTS = `
mutation UpdateDoctorTimeSlots($updateDoctorTimeSlotsId: Int!, $data: DoctorTimeSlotInputUpdate!) {
  updateDoctorTimeSlots(id: $updateDoctorTimeSlotsId, data: $data) {
    id
    doctor_id
    weekday
    timeSlots
    error
  }
}`;

export const GET_APPOINTMENT_BY_DOCTOR_ID = `
query FindAppointmentByDoctor($findAppointmentByDoctorId: Int!) {
  findAppointmentByDoctor(id: $findAppointmentByDoctorId) {
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
  }
}`;

export const CREATE_APPOINTMENT = `
mutation CreateAppointment($data: AppointmentInput!) {
  createAppointment(data: $data) {
    id
    appointment_date
    patient_id
    doctor_id
    duration
    payment_id
    status
  }
}`;

export const FIND_PAYMENT_BY_PATIENTID = `
query FindPaymentByPatientId($findPaymentByPatientIdId: Int!) {
  findPaymentByPatientId(id: $findPaymentByPatientIdId) {
    id
    amount
    payment_date
    is_paid
  }
}`;

export const APPROVED_APPOINTMENT = `
mutation UpdateAppointmentStatus($data: AppointmentUpdateStatus!) {
  updateAppointmentStatus(data: $data) {
    id
    appointment_date
    appointment_time
    patient_id
    doctor_id
    duration
    payment_id
    status
  }
}`;

export const CANCEL_APPOINTMENT = `
mutation CancelAppointment($data: AppointmentCancelInput!) {
  cancelAppointment(data: $data) {
    id
    appointment_date
    appointment_time
    patient_id
    doctor_id
    duration
    payment_id
    status
  }
}`;

export const START_GOOGLE_AUTH = `
query Query {
  startGoogleAuth
}
`;

export const CREATE_MEETING_LINK = `
mutation CreateMeeting($data: CreateGoogleMeet!) {
  createMeeting(data: $data) {
    id
    startTime
    googleMeetUrl
    appointmentsId
  }
}
`;



export  const FILE_UPLOAD = `
mutation Mutation($file: Upload!) {
 uploadFile(file: $file)
}`;


export  const FIND_LAB_APPOINTMENT_BY_PATIENT_ID = `
query FindLabAppointmentByPatientId($findLabAppointmentByPatientIdId: Int!) {
  findLabAppointmentByPatientId(id: $findLabAppointmentByPatientIdId) {
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
}`