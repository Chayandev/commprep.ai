import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BASE_URL,
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

//action/getReadingAssementes
export const getAllReadingAssessments = createAsyncThunk(
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

//action/getAllListeningAssessments
export const getAllListeningAssessments = createAsyncThunk(
  "operation/getAllListeningAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/getListeningAssessments`, {
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
            "An error occurred during fetching listening assesments."
        );
      }
      console.log("getAllListeningAssessments", result);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//action/readingAssesmentAnalysis
export const getReadingAssessmentAnslysis = createAsyncThunk(
  "analysis/readingAssessmentAnalysis",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/analyzeReadingAssessment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: reqData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "An error occurred during analysis of reading assesments."
        );
      }
      console.log("analyze reading assessment", result);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//action//getListeningAssessmentAnalysis
export const getListeningAssessmentAnalysis = createAsyncThunk(
  "analysis/listeningAssessmentAnalysis",
  async (answers, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/analyzeListeningAssessments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(answers),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "An error occurred during analysis of listening assesments."
        );
      }
      console.log("analyze listening assessment", result);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
