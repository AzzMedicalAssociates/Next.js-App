import { createSlice } from "@reduxjs/toolkit";
const initialState = []

export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        registerUser: (state, action) => {
            return [...state, action.payload];
        },
    },
});

export const { registerUser } = registerSlice.actions;
export default registerSlice.reducer;
