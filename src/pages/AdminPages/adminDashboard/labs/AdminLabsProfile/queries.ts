export const LAB_QUERY = `
query FindLabById($findLabByIdId: Int!) {
  findLabById(id: $findLabByIdId) {
    id
    place_name
    logo
    name
    lab_name
    city
    registration_number
    email
    phone_number
    is_verified
  }
}
`;

export const UPDATE_BANNED_LAB = `
mutation UpdateLab($updateLabId: Int!, $data: LabInputUpdate!) {
  updateLab(id: $updateLabId, data: $data) {
    id
    is_verified
  }
}`;