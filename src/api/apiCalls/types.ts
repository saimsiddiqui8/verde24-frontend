
export interface Doctor {
  first_name: string;
  last_name: string;
  // Add more fields as needed
}
export interface PatientData {
  id: string;
  patient_name: string;
  patient_age: number;
  insurance_id: string;
  phone_number: string;
  gender: string;
  weight: number;
  blood_group: string;
  other_history: string;
}
export interface CreatePatientType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  gender: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface UserData {
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  insurance_id: string;
  age: number;
  weight: number;
  blood_group: string;
  other_history: string;
}

interface UpdateDoctorData {
  image?: string;
  name?: string;
  specialty?: string;
}
export interface UpdateDoctorVariables {
  id: string;
  data: UpdateDoctorData
}

export type FindDoctorByIdVariables = {
  findDoctorByIdId: string;
};
export type DoctorAuthVariables = {
  email: string;
  password: string;
};

export type EmailVariables = {
  email: string;
};

export type OtpVariables = {
  email: string;
  role: string;
};

export type VerifyOtpVariables = {
  email: string;
  role: string;
  code: string;
};

export type CreateTimeSlotVariables = {
  data: {
    doctor_id: number;
    weekday: string;
    timeSlots: string[];
  };
};


export type createDoctorData = {
  data: {
    email: string,
    password: string,
  }
}
