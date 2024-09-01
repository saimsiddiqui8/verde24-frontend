import { publicRequest } from "../requestMethods";
import { updatepharmacybyid } from "./types";

export const getPharmacyById = async (
  query: string,
  variables: { findPharmacyByIdId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findPharmacyById;
  } catch (error) {
    console.error("Error fetching pharmacy by ID:", error);
    throw error;
  }
};

export const logoutQuery = async (token: string) => {
  const query = `
    mutation Mutation {
      logout
    }
  `;
  if (!token) return;
  try {
    const response = await publicRequest.post(
      "/graphql",
      { query },
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return response?.data?.data?.logout;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};



export const updatePharmacyById = async (
  query: string,
  variables: { updatePharmacyId: number, data: updatepharmacybyid },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.updatePharmacy;
  } catch (error) {
    console.error("Error updating pharmacy:", error);
    throw error;
  }
};

export const getPharmacyToken = async (
  query: string,
  variables: { email: string; password: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.getPharmacyToken;
  } catch (error) {
    console.error("Error fetching pharmacy token:", error);
    throw error;
  }
};

export const createPharmacy = async (query: string, variables: object) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createPharmacy;
  } catch (error) {
    console.error("Error creating pharmacy:", error);
    throw error;
  }
};

export const findPharmacyByEmail = async (
  query: string,
  variables: { email: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findPharmacyByEmail;
  } catch (error) {
    console.error("Error finding pharmacy by email:", error);
    throw error;
  }
};

export const sendPharmacyOTP = async (
  query: string,
  variables: { email: string; role: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createPharmacyOtp;
  } catch (error) {
    console.error("Error sending pharmacy OTP:", error);
    throw error;
  }
};

export const verifyPharmacyOTP = async (
  query: string,
  variables: { email: string; role: string; code: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response.data.data.verifyPharmacyOtp;
  } catch (error) {
    console.error("Error verifying pharmacy OTP:", error);
    throw error;
  }
};
