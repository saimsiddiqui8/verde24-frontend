import { publicRequest } from "../requestMethods";
import { createDoctorData, CreateTimeSlotVariables, DoctorAuthVariables, EmailVariables, FindDoctorByIdVariables, OtpVariables, UpdateDoctorVariables, VerifyOtpVariables } from "./types";


export const getDoctorById = async (query: string, variables: FindDoctorByIdVariables) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.findDoctorById;
  } catch (error) {
    console.error("Error fetching doctor:");
    throw error;
  }
};


export const getDoctorToken = async (query: string, variables: DoctorAuthVariables) => {
  const response = await publicRequest.post("/graphql", {
    query,
    variables,
  });
  return response.data.data.getDoctorToken;
};

export const createDoctor = async (query: string, variables: createDoctorData) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createDoctor);
};

export const updateDoctor = async (query: string, variables: UpdateDoctorVariables) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response.data.data.updateDoctor;
  } catch (error) {
    console.error("Error creating doctor:");
    throw error;
  }
};

export const checkDoctorEmail = async (query: string, variables: EmailVariables) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.findDoctorByEmail);
};

export const sendDoctorOTP = async (query: string, variables: OtpVariables) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createUserOtp);
};

export const verifyDoctorOTP = async (query: string, variables: VerifyOtpVariables) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.verifyUserOtp);
};

export const createDoctorTimeSlot = async (query: string, variables: CreateTimeSlotVariables) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createDoctorTimeSlot);
};
