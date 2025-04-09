export const PHARMACY_QUERY = `
query FindPharmacyById($findPharmacyByIdId: Int!) {
  findPharmacyById(id: $findPharmacyByIdId) {
    id
    place_name
    logo
    name
    pharmacy_name
    city
    registration_number
    email
    phone_number
    is_verified
  }
}
`;

export const UPDATE_BANNED_PHARMACY = `
mutation Mutation($updatePharmacyId: Int!, $data: PharmacyInputUpdate!) {
  updatePharmacy(id: $updatePharmacyId, data: $data) {
    id
    is_verified
  }
}`;
