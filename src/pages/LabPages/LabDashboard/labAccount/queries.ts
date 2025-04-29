export const FIND_LAB_QUERY = `
 query FindLabById($findLabByIdId: Int!) {
  findLabById(id: $findLabByIdId) {
    logo
    name
    latitude
    longitude
    place_name
    lab_name
    city
    registration_number
    email
    phone_number
    is_verified
    createdAt
  }
}
`;

export const UPDATED_LAB_QUERY = `
mutation UpdateLab($updateLabId: Int!, $data: LabInputUpdate!) {
  updateLab(id: $updateLabId, data: $data) {
    logo
    name
    lab_name
    city
    registration_number
    email
    phone_number
    createdAt
  }
}
`;

export const UPDATED_LAB_CORDINATES = `
mutation UpdateLabCoordinates($updateLabCoordinatesId: Int!, $latitude: Float!, $longitude: Float!, $placeName: String!) {
  updateLabCoordinates(id: $updateLabCoordinatesId, latitude: $latitude, longitude: $longitude, place_name: $placeName) {
    latitude
    longitude
    place_name
  }
}
  `;

export const ADD_LAB_TEST = `
mutation Mutation($data: LabTestsInput!) {
  createLabTest(data: $data) {
    id
    lab_id
    title
    price
    description
    createdAt
  }
} `;

export const FIND_ALL_LAB_TEST_BY_LAB_ID = `
query FindAllLabTestsByLabId($findAllLabTestsByLabIdId: Int!) {
  findAllLabTestsByLabId(id: $findAllLabTestsByLabIdId) {
    id
    lab_id
    title
    price
    description
    createdAt
  }
}`;

export const DELETE_LAB_TEST_BY_ID = `
mutation DeleteLabTest($deleteLabTestId: Int!) {
  deleteLabTest(id: $deleteLabTestId) {
    id
    lab_id
    title
    price
    description
    createdAt
  }
}`;

export const FIND_LAB_TEST_BY_ID = `
query FindLabTestById($findLabTestByIdId: Int!) {
  findLabTestById(id: $findLabTestByIdId) {
    id
    lab_id
    title
    price
    description
    createdAt
  }
}`;

export const UPDATE_LAB_TEST_BY_ID = `
mutation UpdateLabTest($updateLabTestId: Int!, $data: LabTestInputUpdate!) {
  updateLabTest(id: $updateLabTestId, data: $data) {
    id
    lab_id
    title
    price
    description
    createdAt
  }
}`;

export const FIND_APPOINTMENT_BY_STATUS = `
query FindLabAppointmentstatusByLabId($labId: Int!, $status: LabAppointmentStatus!) {
  findLabAppointmentstatusByLabId(lab_id: $labId, status: $status) {
    id
    appointment_date
    appointment_time
    appointment_weekday
    patient_name
     labTests {
      labTestId
    }
  }
}`;

export const UPDATE_LAB_APPOINTMENT_STATUS = `
mutation Mutation($updateLabAppointmentStatusId: Int!, $status: LabAppointmentStatus!, $message: String) {
  updateLabAppointmentStatus(id: $updateLabAppointmentStatusId, status: $status, message: $message) {
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

export const FIND_APPOINTMENT_BY_ID = `
query FindLabAppointmentById($findLabAppointmentByIdId: Int!) {
  findLabAppointmentById(id: $findLabAppointmentByIdId) {
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
    labTests {
      labTest {
        title
        price
        description
      }
    }
  }
}`;
