import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import verificationReducer from "../features/verificationSlice.js";
import userOperationRecuder from "../features/userOperationSlice.js";
import layoutChangerReducer from "../features/layoutChangerSlice.js"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    verify: verificationReducer,
    operation: userOperationRecuder,
    layoutChanger:layoutChangerReducer
  },
});
