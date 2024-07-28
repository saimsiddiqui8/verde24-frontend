import { publicRequest } from "../requestMethods";


export const getDoctorById = async (query: string, variables: { findDoctorByIdId: string }) => {
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


export const getDoctorToken = async (query: string, variables: { email: string, password: string }) => {
  const response = await publicRequest.post("/graphql", {
    query,
    variables,
  });
  return response.data.data.getDoctorToken;
};

export const createDoctor = async (query: string, variables: any) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createDoctor);
};

export const updateDoctor = async (query: string, variables: { is_verified: boolean }) => {
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

export const checkDoctorEmail = async (query: string, variables: { email: string }) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.findDoctorByEmail);
};

export const sendDoctorOTP = async (query: string, variables: { email: string, role: string }) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createUserOtp);
};

export const verifyDoctorOTP = async (query: string, variables: { email: string, role: string, code: string }) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.verifyUserOtp);
};

export const createDoctorTimeSlot = async (query: string, variables: { data: { doctor_id: number; weekday: string; timeSlots: string[] } }) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createDoctorTimeSlot);
};
