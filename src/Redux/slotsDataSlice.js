import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const slotsData = createSlice({
  name: "slotsData",
  initialState,
  reducers: {
    addSlotsData: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeSlotsData: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addSlotsData, removeSlotsData } = slotsData.actions;
export default slotsData.reducer;
