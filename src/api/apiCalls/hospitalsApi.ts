import { publicRequest } from "../requestMethods";

export const getAllHospitals = async (
  query: string,
) => {
  const response = await publicRequest.post("/graphql", {
    query,
  });
  return response.data.data.hospitals;
};