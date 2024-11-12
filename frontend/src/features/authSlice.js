import { createSlice } from "@reduxjs/toolkit";


const INITIAL_STATE = {
    token:null,
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
        }
    }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;