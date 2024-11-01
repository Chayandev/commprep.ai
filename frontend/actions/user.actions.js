import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GET_ALL_READING_ASSESMENTS,
  REFRESH_ACCESSTOKEN_ROUTE,
  SEND_VERIFICATION_CODE,
  VERIFY_USER_EMAIL_ROUTE,
} from "../constants";

//action/send-verificationcode
export const sendVerificationCode = createAsyncThunk(
  "verify/sendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(SEND_VERIFICATION_CODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email), // Ensure email is sent as an object
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "An error occurred during sending verification code."
        );
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

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

//action/getReadingAssementes
export const getAllReadingAssesments = createAsyncThunk(
  "operation/getAllReadingAssesments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(GET_ALL_READING_ASSESMENTS, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "An error occurred during fetching reading assesments."
        );
      }
      console.log("getAllReadingAssesments", result);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
