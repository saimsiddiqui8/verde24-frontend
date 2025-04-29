import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    id: null,
    token: null,
    email: null,
    role: null,
    is_verified: null,
    latitude: null,
    longitude: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    flushUser: (state) => {
      state.currentUser = {
        id: null,
        token: null,
        email: null,
        role: null,
        is_verified: null,
        latitude: null,
        longitude: null,
      };
    },
  },
});

export const { setUser, flushUser } = userSlice.actions;

export default userSlice.reducer;
