import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  autoLoginUser,
  logoutUser,
  resetPassword,
} from "../../actions/auth.actions.js";

const initialState = {
  user: null,
  isProcessing: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Registration
    builder.addCase(registerUser.pending, (state) => {
      state.isProcessing = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.user = action.payload?.data;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isProcessing = false;
    });

    //login
    builder.addCase(loginUser.pending, (state) => {
      state.isProcessing = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.isAuthenticated = true;
      state.user = action.payload?.data;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isProcessing = false;
    });

    //auto-login
    builder.addCase(autoLoginUser.pending, (state) => {
      state.isProcessing = true;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(autoLoginUser.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.user = action.payload?.data;
      state.isAuthenticated = true;
    });

    builder.addCase(autoLoginUser.rejected, (state, action) => {
      state.isProcessing = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    //logout
    builder.addCase(logoutUser.pending, (state, _) => {
      state.isProcessing = true;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.isAuthenticated = false;
      state.isProcessing = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isProcessing = false;
    });

    //reset-password
    builder.addCase(resetPassword.pending, (state, _) => {
      state.isProcessing = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isProcessing = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isProcessing = false;
    });
  },
});

export default authSlice.reducer; // Export the reducer
