export const HOSPITAL_QUERY = `
query($id:String!) {
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
query($ids: [Int]!) {
  findDoctorsByIds(ids: $ids) {
    id
    first_name
    last_name
  }
}
`;
