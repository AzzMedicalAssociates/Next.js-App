import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const selectedProviderDataSlice = createSlice({
  name: "selectedProviderData",
  initialState,
  reducers: {
    addSelectedProviderData: (state, action) => {
      state.push(action.payload);
    },
    removeSelectedProviderData: (state, action) => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addSelectedProviderData, removeSelectedProviderData } =
  selectedProviderDataSlice.actions;

export default selectedProviderDataSlice.reducer;
