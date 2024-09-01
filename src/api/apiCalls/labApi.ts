import { publicRequest } from "../requestMethods";
import { UpdateLabResponse } from "./types";

// Function to get lab by ID
export const getLabById = async (
  query: string,
  variables: { findLabByIdId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findLabById;
  } catch (error) {
    console.error("Error fetching lab by ID:", error);
    throw error;
  }
};


// Function to update lab by ID
export const updateLabById = async (
  query: string,
  variables: { updateLabId: number; data: UpdateLabResponse },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    console.log("GraphQL Response:", response);
    return response?.data?.data?.updateLab;
  } catch (error) {
    console.error("Error updating lab:", error);
    throw error;
  }
};

// Function to get lab token
export const getLabToken = async (
  query: string,
  variables: { email: string; password: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.getLabToken;
  } catch (error) {
    console.error("Error getting lab token:", error);
    throw error;
  }
};

// Function to create a new lab
export const createLab = async (query: string, variables: object) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createLab;
  } catch (error) {
    console.error("Error creating lab:", error);
    throw error;
  }
};

// Function to find lab by email
export const findLabByEmail = async (
  query: string,
  variables: { email: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findLabByEmail;
  } catch (error) {
    console.error("Error finding lab by email:", error);
    throw error;
  }
};

// Function to send OTP to lab
export const sendLabOTP = async (
  query: string,
  variables: { email: string; role: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createUserOtp;
  } catch (error) {
    console.error("Error sending lab OTP:", error);
    throw error;
  }
};

// Function to verify lab OTP
export const verifyLabOTP = async (
  query: string,
  variables: { email: string; role: string; code: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.verifyUserOtp;
  } catch (error) {
    console.error("Error verifying lab OTP:", error);
    throw error;
  }
};
