import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  
  BASE_URL,
} from "../constants";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
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
      const response = await fetch(`${BASE_URL}/login`, {
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/autoLogin`, {
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

//resetpassword
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/resetPassword`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "An error occurred during password reset"
        );
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "An error occurred during logout");
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
//action/refresh-access-token
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/refreshAccessToken`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred during refresh access token."
      );
    }
    return result;
  } catch (error) {
    throw error;
  }
};
