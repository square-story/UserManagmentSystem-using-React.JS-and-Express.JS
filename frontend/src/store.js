import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import profileReducer from "./features/profileSlice";
import usersReducer from './features/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile:profileReducer,
    users:usersReducer
  },
});

