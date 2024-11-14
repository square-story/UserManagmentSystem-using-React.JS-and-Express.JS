import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    token: localStorage.getItem("token") || null, // Get token from local storage on load
    userDetails: JSON.parse(localStorage.getItem("userDetails")) || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action) => {
            state.userDetails = action.payload.user;
            state.token = action.payload.token;
            // Save to local storage
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("userDetails", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.userDetails = null; // Fixed: changed state.user to state.userDetails
            state.token = null;
            localStorage.removeItem("token"); 
            localStorage.removeItem("userDetails");
        }
    }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
