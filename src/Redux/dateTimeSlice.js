import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const dateTimeSlice = createSlice({
  name: "dateTime",
  initialState,
  reducers: {
    addDateTime: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeDateTime: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addDateTime, removeDateTime } = dateTimeSlice.actions;
export default dateTimeSlice.reducer;
