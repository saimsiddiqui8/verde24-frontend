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
