import { createSlice } from "@reduxjs/toolkit";

interface DateType {
  fullDate: string;
  date: number;
  dayOfWeek: number;
}

interface BookingState {
  selectedDate: DateType | null;
  selectedDay: string | null;
  selectedTime: string | null;
  id: number | null;
  amount: number | null;
  currency: string | null;
}

const initialState: BookingState = {
  selectedDate: null,
  selectedDay: null,
  selectedTime: null,
  id: null,
  amount: null,
  currency: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.selectedDate = action.payload.selectedDate;
      state.selectedDay = action.payload.selectedDay;
      state.selectedTime = action.payload.selectedTime;
      state.id = action.payload.id;
      state.amount = action.payload.amount;
      state.currency = action.payload.currency;
    },
    updateBooking: (state, action) => {
      if (action.payload.selectedDate) {
        state.selectedDate = action.payload.selectedDate;
      }
      if (action.payload.selectedDay) {
        state.selectedDay = action.payload.selectedDay;
      }
      if (action.payload.selectedTime) {
        state.selectedTime = action.payload.selectedTime;
      }
      if (action.payload.id) {
        state.id = action.payload.id;
      }
      if (action.payload.amount) {
        state.amount = action.payload.amount;
      }
      if (action.payload.currency) {
        state.currency = action.payload.currency;
      }
    },
    deleteBooking: (state) => {
      state.selectedDate = null;
      state.selectedDay = null;
      state.selectedTime = null;
      state.id = null;
      state.amount = null;
      state.currency = null;
    },
  },
});

export const { addBooking, updateBooking, deleteBooking } =
  bookingSlice.actions;

export default bookingSlice.reducer;
