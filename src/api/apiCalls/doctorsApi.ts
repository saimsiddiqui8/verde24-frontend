import { publicRequest } from "../requestMethods";
import {
  AppointmentUpdateStatus,
  createDoctorData,
  CreateMeetingLink,
  CreateTimeSlotVariables,
  DoctorAuthVariables,
  EmailVariables,
  FindDoctorByIdVariables,
  FindDoctorTimeSlotsVariables,
  OtpVariables,
  PaymentVariables,
  UpdateDoctorTimeSlotVariables,
  UpdateDoctorVariables,
  VerifyOtpVariables,
} from "./types";

export const getDoctorTimeSlots = async (
  query: string,
  variables: FindDoctorTimeSlotsVariables,
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.findDoctorTimeSlots;
  } catch (error) {
    console.error("Error fetching doctor time slots:");
    throw error;
  }
};

export const stripePayment = async (
  query: string,
  variables: PaymentVariables,
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.createPayment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getDoctorById = async (
  query: string,
  variables: FindDoctorByIdVariables,
) => {
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

export const getDoctorToken = async (
  query: string,
  variables: DoctorAuthVariables,
) => {
  const response = await publicRequest.post("/graphql", {
    query,
    variables,
  });
  return response.data.data.getDoctorToken;
};

export const createDoctor = async (
  query: string,
  variables: createDoctorData,
) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createDoctor);
};

export const updateDoctor = async (
  query: string,
  variables: { updateDoctorId: number | null; data: UpdateDoctorVariables },
) => {
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

export const deleteDoctorTimeSlots = async (
  query: string,
  variables: { deleteDoctorTimeSlotsId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response.data.data.deleteDoctorTimeSlots;
  } catch (error) {
    console.error("Error deleting time slots:", error);
    throw error;
  }
};

export const updateDoctorTimeSlots = async (
  query: string,
  variables: {
    updateDoctorTimeSlotsId: number | null;
    data: UpdateDoctorTimeSlotVariables;
  },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response.data.data.updateDoctorTimeSlots;
  } catch (error) {
    console.error("Error updating doctor time slots:", error);
    throw error;
  }
};

export const findAppointmentByDoctor = async (
  query: string,
  variables: { findAppointmentByDoctorId: number | null },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response.data.data.findAppointmentByDoctor;
  } catch (error) {
    console.error("Error fetching appointments for doctor:", error);
    throw error;
  }
};

export const checkDoctorEmail = async (
  query: string,
  variables: EmailVariables,
) => {
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

export const verifyDoctorOTP = async (
  query: string,
  variables: VerifyOtpVariables,
) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.verifyUserOtp);
};

export const createDoctorTimeSlot = async (
  query: string,
  variables: CreateTimeSlotVariables,
) => {
  return publicRequest
    .post("/graphql", {
      query,
      variables,
    })
    .then((response) => response.data.data.createDoctorTimeSlots);
};

export const updateAppointmentStatus = async (
  query: string,
  data: AppointmentUpdateStatus,
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { data },
    });

    return response?.data?.data?.updateAppointmentStatus;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const cancelAppointment = async (
  query: string,
  data: {
    appointment_id: number | null;
    patient_id: number | null;
    amount: number | null;
  },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { data },
    });

    return response?.data?.data?.cancelAppointment;
  } catch (error) {
    console.error("Error canceling appointment:", error);
    throw error;
  }
};

export const startGoogleAuth = async (query: string) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
    });
    return response?.data?.data?.startGoogleAuth;
  } catch (error) {
    console.error("Error creating startGoogleAuth:", error);
    throw error;
  }
};

export const createMeeting = async (query: string, data: CreateMeetingLink) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { data },
    });
    return response?.data?.data?.createMeeting;
  } catch (error) {
    console.error("Error creating Meeting Link:", error);
    throw error;
  }
};
