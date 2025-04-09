export const GET_ALL_PHARMACY = `
query GetAllPharmacies {
  getAllPharmacies {
    id
    pharmacy_name
    is_verified
  }
}`;
