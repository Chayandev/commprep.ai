import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import verificationReducer from "../features/verificationSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    verify: verificationReducer,
  },
});
