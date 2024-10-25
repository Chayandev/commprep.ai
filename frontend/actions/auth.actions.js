import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LOGIN_USER_ROUTE,
  REGISTER_USER_ROUTE,
  AUTO_LOGIN_ROUTER,
  LOGOUT_USER,
} from "../constants";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(REGISTER_USER_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "An error occurred during registration."
        );
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//actions/loginuser
export const loginUser = createAsyncThunk(
  "auth/login",
  async (logindata, { rejectWithValue }) => {
    try {
      const response = await fetch(LOGIN_USER_ROUTE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "An error occurred during login.");
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//auto login user
export const autoLoginUser = createAsyncThunk(
  "auth/autoLogin",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await fetch(AUTO_LOGIN_ROUTER, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "An error occurred during auto login"
        );
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const logoutUser=createAsyncThunk("auth/logout",async(_,{rejectWithValue})=>{
  try {
    const response = await fetch(LOGOUT_USER, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred during logout"
      );
    }
    return result;
  } catch (error) {
    return rejectWithValue(error.message || "Something went wrong");
  }
})