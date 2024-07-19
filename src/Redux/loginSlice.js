import { createSlice } from "@reduxjs/toolkit";

const initialState = [false];

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    addLogin: (state, action) => {
      return [action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLogin } = loginSlice.actions;
export default loginSlice.reducer;
