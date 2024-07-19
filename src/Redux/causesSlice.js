import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const causesSlice = createSlice({
  name: "causes",
  initialState,
  reducers: {
    addCauses: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeCauses: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addCauses, removeCauses } = causesSlice.actions;
export default causesSlice.reducer;
