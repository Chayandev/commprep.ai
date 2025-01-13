import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import verificationReducer from "../features/verificationSlice.js";
import userOperationRecuder from "../features/userOperationSlice.js";
import assessmentAnalysisRecuder from "../features/assessmentAnalysisSlice.js";
import sessionHandlerReducer from "../features/sessionHandlerSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    verify: verificationReducer,
    operation: userOperationRecuder,
    assessmentAnalysis: assessmentAnalysisRecuder,
    session: sessionHandlerReducer,
  },
});
