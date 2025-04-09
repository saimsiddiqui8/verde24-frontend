import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { labAppointmenttype, labTests } from "../../api/apiCalls/types";

const initialState: labAppointmenttype = {
  appointment_date: null,
  appointment_time: null,
  appointment_weekday: null,
  lab_id: null,
  patient_age: null,
  patient_email: null,
  patient_gender: null,
  patient_id: null,
  patient_name: null,
  patient_phone_number: null,
  currency: null,
  labTests: [],
};

const LabBookinyslice = createSlice({
  name: "LabBooking",
  initialState,
  reducers: {
    addLabdetail: (state, action) => {
      state.lab_id = action.payload.lab_id;
      state.patient_id = action.payload.patient_id;
      state.currency = action.payload.currency;
    },
    addPatientdetail: (state, action) => {
      state.patient_name = action.payload.patient_name;
      state.patient_email = action.payload.patient_email;
      state.patient_age = action.payload.patient_age;
      state.patient_gender = action.payload.patient_gender;
      state.patient_phone_number = action.payload.patient_phone_number;
    },
    addPatientaddress: (state, action) => {
      state.appointment_date = action.payload.appointment_date;
      state.appointment_time = action.payload.appointment_time;
      state.appointment_weekday = action.payload.appointment_weekday;
    },
    deleteLabDetail: (state) => {
      state.lab_id = null;
      state.patient_id = null;
      state.currency = null;
    },
    deletePatientDetail: (state) => {
      state.patient_name = null;
      state.patient_email = null;
      state.patient_age = null;
      state.patient_gender = null;
      state.patient_phone_number = null;
    },
    deletePatientAddress: (state) => {
      state.appointment_date = null;
      state.appointment_time = null;
      state.appointment_weekday = null;
    },
    deleteLabBooking: () => initialState,
    addLabTestLocal: (state, action: PayloadAction<labTests>) => {
      state.labTests.push(action.payload);
    },
    deleteLabTestLocal: (state, action: PayloadAction<string | null>) => {
      state.labTests = state.labTests.filter(
        (test) => test.id !== action.payload,
      );
    },
    clearAlllabTests: (state) => {
      state.labTests = [];
    },
  },
});

export const {
  addLabdetail,
  addPatientdetail,
  addPatientaddress,
  deleteLabBooking,
  deleteLabDetail,
  deletePatientDetail,
  deletePatientAddress,
  addLabTestLocal,
  deleteLabTestLocal,
  clearAlllabTests,
} = LabBookinyslice.actions;

export default LabBookinyslice.reducer;
