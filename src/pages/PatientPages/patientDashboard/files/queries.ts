export const CREATE_REPORT_BY_PATIENT = `
mutation CreateReport($data: PatientReportInput!) {
  createReport(data: $data) {
    id
    files
    patient_id
  }
}`;

export const FIND_REPORT_BY_PATIENT_ID = `
query GetPatientReport($getPatientReportId: Int!) {
  getPatientReport(id: $getPatientReportId) {
    id
    files
    patient_id
  }
}`;

export const ASSIGN_TO_DOCTOR = `
mutation AssignReportToDoctor($data: AssignDoctorReportInput!) {
  assignReportToDoctor(data: $data) {
    id
    files
    patient_id
    doctor_id
  }
}`;

export const GET_PRESCRIPTION_BY_DOCTOR_NAME = `
query GetAllPrescriptionByPatientId($patientId: Int!) {
  getAllPrescriptionByPatientId(patient_id: $patientId) {
    id
    labTests
    specialInstructions
    prescriptionUrl
    createdAt
    doctor {
      first_name
      last_name
    }
  }
}`;