export const FIND_LAB_QUERY = `
 query FindLabById($findLabByIdId: Int!) {
  findLabById(id: $findLabByIdId) {
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
    is_verified
    createdAt
  }
}
`;
