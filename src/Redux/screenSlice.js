import { createSlice } from "@reduxjs/toolkit";

const initialState = [1];

export const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    addScreen: (state, action) => {
      return [action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addScreen } = screenSlice.actions;
export default screenSlice.reducer;
