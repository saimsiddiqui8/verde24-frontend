export const GET_ALL_LABS = `
query GetAllLabs {
  getAllLabs {
    id
    lab_name
    is_verified
  }
}`;