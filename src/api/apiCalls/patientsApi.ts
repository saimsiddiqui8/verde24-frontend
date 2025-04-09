import { VERIFIED_DOCTOR_QUERY } from "../../pages/PatientPages/patientDashboard/findDoctor/queries";
import { publicRequest } from "../requestMethods";
import {
  CreateAppointmentData,
  CreatePatientType,
  CreateReportType,
  labAppointmenttypecheckout,
  NearestLabType,
  UserData,
} from "./types";

export const getPatientById = async (
  query: string,
  variables: { id: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findPatientById;
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    throw error;
  }
};

export const updatePatientById = async (
  query: string,
  variables: { updatePatientId: number; data: UserData },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.updatePatient;
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

export const getPatientToken = async (
  query: string,
  variables: { email: string; password: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.getPatientToken;
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

export const createPatient = async (
  query: string,
  variables: CreatePatientType,
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { data: variables },
    });
    return response?.data?.data?.createPatient;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

export const createAppointmentDoctor = async (
  query: string,
  variables: CreateAppointmentData,
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    if (response?.data?.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }
    return response?.data?.data?.createAppointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const findPatientByEmail = async (
  query: string,
  variables: { email: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.findPatientByEmail;
  } catch (error) {
    console.error("Error finding patient by email:", error);
    throw error;
  }
};

export const sendPatientOTP = async (
  query: string,
  variables: { email: string; role: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.createUserOtp;
  } catch (error) {
    console.error("Error sending patient OTP:", error);
    throw error;
  }
};

export const verifyPatientOTP = async (
  query: string,
  variables: { email: string; role: string; code: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", { query, variables });
    return response?.data?.data?.verifyUserOtp;
  } catch (error) {
    console.error("Error verifying patient OTP:", error);
    throw error;
  }
};

export const findAppointmentByPatient = async (
  query: string,
  variables: { findAppointmentByPatientId: number | null },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.findAppointmentByPatient;
  } catch (error) {
    console.error("Error fetching appointments for patient:", error);
    throw error;
  }
};

export const findPaymentByPatient = async (
  query: string,
  variables: { findPaymentByPatientId: number | null },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { findPaymentByPatientIdId: variables.findPaymentByPatientId },
    });
    return response?.data?.data?.findPaymentByPatientId;
  } catch (error) {
    console.error("Error fetching payments for patient:", error);
    throw error;
  }
};

export const findPatientReportById = async (
  query: string,
  variables: { getPatientReportId: number | null },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.getPatientReport;
  } catch (error) {
    console.error("Error fetching report for patient:", error);
    throw error;
  }
};

export const getVerifiedDoctors = async () => {
  try {
    const response = await publicRequest.post("/graphql", {
      query: VERIFIED_DOCTOR_QUERY,
      variables: { is_verified: true },
    });
    return response.data.data.findDoctorsByVerificationStatus;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const CreateReportByPatient = async (
  query: string,
  data: CreateReportType,
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { data },
    });
    return response?.data?.data?.createReport;
  } catch (error) {
    console.error("Error creating by patient Report:", error);
    throw error;
  }
};
export const findNearestLabs = async (query: string, data: NearestLabType) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables: { data },
    });
    return response?.data?.data?.findNearestLabs;
  } catch (error) {
    console.error("Error finding labs:", error);
    throw error;
  }
};

export const LabAppointmentBooking = async (
  query: string,
  variables: { data: labAppointmenttypecheckout },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });

    if (response?.data?.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return response?.data?.data?.createLabAppointment;
  } catch (error) {
    console.error("Error creating Lab Appointment:", error);
    throw error;
  }
};

export const AddToCard = async (
  query: string,
  variables: { data: { patient_id: number; labTest_id: number } },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    if (response?.data?.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }
    return response?.data?.data?.addLabTestToCart;
  } catch (error) {
    console.error("Error addLabTestToCart:", error);
    throw error;
  }
};

export const FindCardById = async (
  query: string,
  variables: { patientId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.findCartByPatientId;
  } catch (error) {
    console.error("Error findCartByPatientId:", error);
    throw error;
  }
};

export const DeleteCard = async (
  query: string,
  variables: { deleteItemFromCartId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.deleteItemFromCart;
  } catch (error) {
    console.error("Error deleteItemFromCart:", error);
    throw error;
  }
};

export const DeleteAllCard = async (
  query: string,
  variables: { patientId: number | null },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.deleteAllItemsFromCart;
  } catch (error) {
    console.error("Error deleteAllItemsFromCart:", error);
    throw error;
  }
};

export const FindLabAppointmentByPatientId = async (
  query: string,
  variables: { findLabAppointmentByPatientIdId: number },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.findLabAppointmentByPatientId;
  } catch (error) {
    console.error("Error findLabAppointmentByPatientId:", error);
    throw error;
  }
};

export const SearchLabname = async (
  query: string,
  variables: { labName: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.searchLabs;
  } catch (error) {
    console.error("Error searchLabs:", error);
    throw error;
  }
};

export const SearchLabtest = async (
  query: string,
  variables: { labTestName: string },
) => {
  try {
    const response = await publicRequest.post("/graphql", {
      query,
      variables,
    });
    return response?.data?.data?.searchlabTests;
  } catch (error) {
    console.error("Error searchlabTests:", error);
    throw error;
  }
};
