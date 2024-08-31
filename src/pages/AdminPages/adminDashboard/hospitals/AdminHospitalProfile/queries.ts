export const HOSPITAL_QUERY = `
query($id: Int!) {
  findHospitalById(id: $id) {
    id,
    name,
    location,
    phone_number,
    doctorHospitals{
      doctor_id,

    }
  }
}
`;

export const DOCTOR_QUERY = `
query FindDoctorsByIds($ids: [Int]!) {
  findDoctorsByIds(ids: $ids) {
  id
  first_name
  last_name
  }
}
`;
