import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const selectedProviderSlice = createSlice({
  name: "selectedProvider",
  initialState,
  reducers: {
    addSelectedProvider: (state, action) => {
      state.push(action.payload);
    },
    removeSelectedProvider: (state, action) => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addSelectedProvider, removeSelectedProvider } =
  selectedProviderSlice.actions;

export default selectedProviderSlice.reducer;
