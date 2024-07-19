import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addForm: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeForm: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addForm, removeForm } = formSlice.actions;
export default formSlice.reducer;
