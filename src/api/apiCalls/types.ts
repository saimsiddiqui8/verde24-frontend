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