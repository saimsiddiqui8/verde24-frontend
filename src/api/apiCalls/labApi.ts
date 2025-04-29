import { publicRequest } from "../requestMethods";
import { AddLabTestType, UpdateLabResponse } from "./types";

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

export const createLab = async (query: string, variables: object) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createLab;
  } catch (error) {
    console.error("Error creating lab:", error);
    throw error;
  }
};

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

export const updateLabCoordinatesById = async (
  query: string,
  variables: {
    updateLabCoordinatesId: number;
    latitude: number;
    longitude: number;
    placeName: string;
  },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.updateLabCoordinates;
  } catch (error) {
    console.error("Error updating pharmacy coordinates:", error);
    throw error;
  }
};

export const addLabTest = async (
  query: string,
  variables: { data: AddLabTestType },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createLabTest;
  } catch (error) {
    console.error("Error creating lab test:", error);
    throw error;
  }
};

export const FindAllLabTestByLabId = async (
  query: string,
  variables: { findAllLabTestsByLabIdId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findAllLabTestsByLabId;
  } catch (error) {
    console.error("Error finding all lab test by id:", error);
    throw error;
  }
};

export const DeleteLabTestById = async (
  query: string,
  variables: { deleteLabTestId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.deleteLabTest;
  } catch (error) {
    console.error("Error deleting lab test by id:", error);
    throw error;
  }
};

export const FindLabTestById = async (
  query: string,
  variables: { findLabTestByIdId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findLabTestById;
  } catch (error) {
    console.error("Error finding lab test by id:", error);
    throw error;
  }
};

export const UpdateLabTestById = async (
  query: string,
  variables: { updateLabTestId: number; data: AddLabTestType },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.updateLabTest;
  } catch (error) {
    console.error("Error updating lab test by id:", error);
    throw error;
  }
};

export const FindAppointmentByStatus = async (
  query: string,
  variables: { labId: number; status: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findLabAppointmentStatusByLabId;
  } catch (error) {
    console.error("Error find Appointment By Status:", error);
    throw error;
  }
};

export const UpdateLabAppointmentStatus = async (
  query: string,
  variables: {
    updateLabAppointmentStatusId: number;
    status: string;
    message?: string;
  },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.updateLabAppointmentStatus;
  } catch (error) {
    console.error("Error updateLabAppointment Status:", error);
    throw error;
  }
};

export const FindAppointmentById = async (
  query: string,
  variables: { findLabAppointmentByIdId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findLabAppointmentById;
  } catch (error) {
    console.error("Error findLabAppointmentById Status:", error);
    throw error;
  }
};
