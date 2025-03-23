
export interface Doctor {
  first_name: string;
  last_name: string;
  id: number;
}

type Slot = {
  id: number;
  doctorTimeSlotId: number;
  time: string;
  status: string;
};

export interface TimeSlot {
  id: number;
  doctor_id: number;
  weekday: string;
  timeSlots: Slot[];
  error: string | null;
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
  latitude: number;
  longitude: number;
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
  image?:string;
  gender: string;
  phone_number: string;
  insurance_id: string;
  age: number;
  weight: number;
  blood_group: string;
  other_history: string;
  patient_name?:string;
  patient_age?:string;
}

export interface UpdateDoctorData {
  online?: boolean;
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  is_verified?: boolean;
  form_submitted?: boolean;
  image?: string;
  city?: string;
  country?: string;
  department?: string;
  experience?: string;
  registration_no?: string;
  qualification?: string;
  consultation_mode?: string;
  consultation_fee_regular?: number | undefined; 
  consultation_fee_discounted?: number | undefined; 
  payout_method?: string;
  payout_method_id?: string;
  address?: string;
  postal_code?: string;
  services?: string;
  specialization?: string;
  bibliography?: string;
  work?: string;
  degree?: string;
  designation?: string;
  enterSymptom?: string;
  institute?: string;
  complete_name?: string;
  ac_no?: string;
  upi_id?: string;
}


export type FindDoctorByIdVariables = {
  findDoctorByIdId: number | null;
};

export type FindDoctorTimeSlotsVariables = {
  findDoctorTimeSlotsId: number | null;
};

export type UpdateDoctorTimeSlotVariables = {
  doctor_id: number;
  weekday: string;
  timeSlots: string[];
};

interface PaymentInput {
  amount: number | null;
  currency: string | null;
  payment_method: string;
  patient_id: number | null;
}

export interface PaymentVariables {
  data: PaymentInput;
}

export type DoctorAuthVariables = {
  email: string;
  password: string;
};

interface doctorAppointment {
  appointment_date: string | null;
  appointment_type: string | null | "video" | "in-person";
  patient_id: number | null;
  doctor_id: number | null;
  duration: number | null;
  payment_id: number | null;
}

export interface doctorAppointmentVariables {
  data: doctorAppointment;
}

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

type SlotInput = {
  time: string;
  status: string;
};

export type CreateTimeSlotVariables = {
  data: {
    doctor_id: number;
    weekday: string;
    timeSlots: SlotInput[];
  };
};

export type createDoctorData = {
  data: {
    email: string;
    password: string;
  };
};

export interface UpdatedPharmacyData {
  logo?: string;
  name: string;
  pharmacy_name: string;
  city: string;
  registration_number: string;
  email: string;
  phone_number: string;
  createdAt?: string;
}

export interface updatePharmacyCoordinatesFData {
  latitude:number;
  longitude:number;
  placeName:string;
}

export interface UpdateLabResponse {
  logo?: string;
  name: string;
  lab_name: string;
  city: string;
  registration_number: string;
  email: string;
  phone_number: string;
  createdAt?: string;
}


export interface CreateLabResponse {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  longitude:number;
  latitude:number;
}

export interface AddlabtestType {
  id?:number;
  title: string;
  price: number;
  lab_id?: number | null;
  description: string;
}

export interface CreateAppointmentType {
  appointment_date: string | null | undefined;
  appointment_time: string | null | undefined;
  patient_id: number | null;
  doctor_id: number | null;
  duration: number | null;
  payment_id?: number | null;
}

export interface CreateAppointmentData {
  data: CreateAppointmentType;
}

export interface AppointmentUpdateStatus {
  id: number | null;
  status: string | null;
}

export interface CreateMeetingLink {
  appointment_id: number;
  code: string | null;
  eventDetails: {
    startTime: string;
    endTime: string;
  };
  userTokens: {
    access_token: string;
    refresh_token: string;
  };
}


export interface hospitalsType {
  id : string,
  name : string
}



export interface CreateReportType {
  files: string[];
  patient_id: number | null;
}
export interface NearestLabType {
  latitude: number;
  longitude: number;
  radiusInKm?: number;
}

 export type labTests = {
  title: string | null;
  price: number | null;
  description: string | null;
  id: number | null;
  lab_id: number | null;
  createdAt: string | null;
};



export interface labAppointmenttype {
  appointment_date: string | null;
  appointment_time: string | null;
  appointment_weekday:string | null
  lab_id: number | null;
  patient_age: number | null;
  patient_email: string | null;
  patient_gender: string | null;
  patient_id: number | null;
  patient_name: string | null;
  patient_phone_number: string | null;
  payment_id?: number | string | null;
  status?: string | null;
  currency?: string | null;
  labTests : labTests[];
}



interface LabTest {
  title: string;
}

export interface PatientAppointmentlab {
  id: number;
  appointment_date: string;  
  appointment_weekday: string; 
  patient_name: string;
  labTest: LabTest;
}