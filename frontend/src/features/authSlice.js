import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  autoLoginUser,
  logoutUser,
} from "../../actions/auth.actions";
import { act } from "react";

const initialState = {
  user: null,
  isLoading:false,
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
      state.user = action.payload;
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
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isProcessing = false;
    });

    //auto-login
    builder.addCase(autoLoginUser.pending, (state) => {
      state.isLoading = true;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(autoLoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(autoLoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = false;
    });

    //logout
    builder.addCase(logoutUser.pending,(state,_)=>{
        state.isProcessing=true;
    })
    builder.addCase(logoutUser.fulfilled,(state,action)=>{
        state.isAuthenticated=false,
        state.isProcessing=false,
        state.user=null
    })
    builder.addCase(logoutUser.rejected,(state,action)=>{
        state.isProcessing=false
    })
  },
});

export default authSlice.reducer; // Export the reducer
