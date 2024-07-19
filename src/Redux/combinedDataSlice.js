import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const combinedData = createSlice({
  name: "combinedData",
  initialState,
  reducers: {
    addCombinedData: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeCombinedData: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addCombinedData, removeCombinedData } = combinedData.actions;
export default combinedData.reducer;
