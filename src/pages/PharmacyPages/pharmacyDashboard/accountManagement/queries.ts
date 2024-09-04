export const FIND_PHARMACY_QUERY = `
  query FindPharmacyById($findPharmacyByIdId: Int!) {
    findPharmacyById(id: $findPharmacyByIdId) {
      email
      logo
      name
      pharmacy_name
      city
      registration_number
      phone_number
      is_verified
      createdAt
    }
  }
`;

export const UPDATED_PHARMACY_QUERY = `
  mutation UpdatePharmacy($updatePharmacyId: Int!, $data: PharmacyInputUpdate!) {
    updatePharmacy(id: $updatePharmacyId, data: $data) {
      logo
      name
      pharmacy_name
      city
      registration_number
      email
      phone_number
      is_verified
      createdAt
    }
  }
`;
