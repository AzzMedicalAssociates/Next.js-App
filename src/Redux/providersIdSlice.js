import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const providersIdSlice = createSlice({
  name: "providersId",
  initialState,
  reducers: {
    addProvidersId: (state, action) => {
      state.push(action.payload);
    },
    removeProvidersId: (state, action) => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addProvidersId, removeProvidersId } = providersIdSlice.actions;

export default providersIdSlice.reducer;
