import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const providersData = createSlice({
  name: "providersData",
  initialState,
  reducers: {
    addProvidersData: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeProvidersData: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addProvidersData, removeProvidersData } = providersData.actions;
export default providersData.reducer;
