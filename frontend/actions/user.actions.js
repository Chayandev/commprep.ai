import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  REFRESH_ACCESSTOKEN_ROUTE,
  VERIFY_USER_EMAIL_ROUTE,
} from "../constants";

//action/emial-verification
export const verifyUserEmail = createAsyncThunk(
  "verify/emailVerification",
  async (verificationCode, { rejectWithValue }) => {
    try {
      const response = await fetch(VERIFY_USER_EMAIL_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationCode),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "An error occurred during email verification."
        );
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
    const response = await fetch(REFRESH_ACCESSTOKEN_ROUTE, {
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
