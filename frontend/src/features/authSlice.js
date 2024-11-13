import { createSlice } from "@reduxjs/toolkit";


const INITIAL_STATE = {
    token:localStorage.getItem("token") || null, // Get token from local storage on load
    user:null,
}



const authSlice = createSlice({
    name: 'auth',
    initialState:INITIAL_STATE,
    reducers: {
        setUser:(state,action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout:(state)=>{
            state.user = null;
            state.token = null;
            localStorage.removeItem("token"); 
        }
    }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;