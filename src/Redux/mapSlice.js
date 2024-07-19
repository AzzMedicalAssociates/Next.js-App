import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    addMap: (state, action) => {
      // Add a new patient to the state
      return [...state, action.payload];
    },
    removeMap: () => {
      // Clear all patients from the state
      return initialState;
    },
  },
});

export const { addMap, removeMap } = mapSlice.actions;
export default mapSlice.reducer;
