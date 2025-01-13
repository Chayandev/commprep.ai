// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { json } from "react-router-dom";
// const BASE_URL = import.meta.env.VITE_BASE_URL;

// console.log(BASE_URL);
// //action/send-verificationcode
// export const sendVerificationCode = createAsyncThunk(
//   "verify/sendVerificationCode",
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/sendVerificationCode`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(email), // Ensure email is sent as an object
//       });
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during sending verification code."
//         );
//       }
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/emial-verification
// export const verifyUserEmail = createAsyncThunk(
//   "verify/emailVerification",
//   async (verificationCode, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/verify-email`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(verificationCode),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || "An error occurred during email verification."
//         );
//       }
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/getReadingAssementes
// export const getAllReadingAssessments = createAsyncThunk(
//   "operation/getAllReadingAssesments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getReadingAssessments`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during fetching reading assesments."
//         );
//       }
//       console.log("getAllReadingAssesments", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/getAllListeningAssessments
// export const getAllListeningAssessments = createAsyncThunk(
//   "operation/getAllListeningAssessments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getListeningAssessments`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during fetching listening assesments."
//         );
//       }
//       console.log("getAllListeningAssessments", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/getGrammarAssessments
// export const getAllGrammarAssessments = createAsyncThunk(
//   "operation/getAllGrammarAssessments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getGrammarAssessments`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during fetching grammar assesments."
//         );
//       }
//       console.log("getALlGrammarAssessments", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/getVocabularyAssessments
// export const getAllVocabularyAssessments = createAsyncThunk(
//   "operation/getAllVocabularyAssessments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getVocabularyAssessments`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during fetching Vocabulary assesments."
//         );
//       }
//       console.log("getALlVocabularyAssessments", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/getVocabularyAssessments
// export const getAllSpeakingAssessments = createAsyncThunk(
//   "operation/getAllSpeakingAssessments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getSpeakingAssessments`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during fetching Speaking assesments."
//         );
//       }
//       console.log("getAllSpeakingAssessments", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action//addUserFeedback
// export const addUserFeedback = createAsyncThunk(
//   "operation/addUserFeedback",
//   async (feedback, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/addUserFeedback`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(feedback),
//       });
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //***************************************************************************************************************** */

// //action/readingAssesmentAnalysis
// export const getReadingAssessmentAnslysis = createAsyncThunk(
//   "analysis/readingAssessmentAnalysis",
//   async (reqData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/analyzeReadingAssessment`, {
//         method: "POST",
//         credentials: "include",
//         body: reqData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during analysis of reading assesments."
//         );
//       }
//       console.log("analyze reading assessment", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action//getListeningAssessmentAnalysis
// export const getListeningAssessmentAnalysis = createAsyncThunk(
//   "analysis/listeningAssessmentAnalysis",
//   async (answers, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/analyzeListeningAssessment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(answers),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during analysis of listening assesments."
//         );
//       }
//       console.log("analyze listening assessment", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action//getGrammarAssessmentAnalysis
// export const getGrammarAssessmentAnalysis = createAsyncThunk(
//   "analysis/grammarAssessmentAnalysis",
//   async (answers, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/analyzeGrammarAssessment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(answers),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during analysis of grammar assesments."
//         );
//       }
//       console.log("analyze grammar assessment", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action//getGrammarAssessmentAnalysis
// export const getVocabularyAssessmentAnalysis = createAsyncThunk(
//   "analysis/vocabularyAssessmentAnalysis",
//   async (answers, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/analyzeVocabularyAssessment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(answers),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during analysis of vocabulary assesments."
//         );
//       }
//       console.log("analyze vocabulary assessment", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// //action/speakingAssesmentAnalysis
// export const getSpeakingAssessmentAnslysis = createAsyncThunk(
//   "analysis/speakingAssessmentAnalysis",
//   async (reqData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/analyzeSpeakingAssessment`, {
//         method: "POST",
//         credentials: "include",
//         body: reqData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during analysis of speaking assesments."
//         );
//       }
//       console.log("analyze speaking assessment", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

// export const getEachTotalAssessmentCount = createAsyncThunk(
//   "operation/getEachTotlaAssessmentCount",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getEachAssessmentCount`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "An error occurred during fetching count of each  assesments."
//         );
//       }
//       console.log("getEachAssessmentCount", result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error.message || "Something went wrong");
//     }
//   }
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Action: Send Verification Code
export const sendVerificationCode = createAsyncThunk(
  "verify/sendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/sendVerificationCode", email);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Verify User Email
export const verifyUserEmail = createAsyncThunk(
  "verify/emailVerification",
  async (verificationCode, { rejectWithValue }) => {
    try {
      const response = await api.post("/verify-email",  verificationCode );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Get All Reading Assessments
export const getAllReadingAssessments = createAsyncThunk(
  "operation/getAllReadingAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getReadingAssessments");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Get All Listening Assessments
export const getAllListeningAssessments = createAsyncThunk(
  "operation/getAllListeningAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getListeningAssessments");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Get All Grammar Assessments
export const getAllGrammarAssessments = createAsyncThunk(
  "operation/getAllGrammarAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getGrammarAssessments");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Get All Vocabulary Assessments
export const getAllVocabularyAssessments = createAsyncThunk(
  "operation/getAllVocabularyAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getVocabularyAssessments");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Get All Speaking Assessments
export const getAllSpeakingAssessments = createAsyncThunk(
  "operation/getAllSpeakingAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getSpeakingAssessments");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Add User Feedback
export const addUserFeedback = createAsyncThunk(
  "operation/addUserFeedback",
  async (feedback, { rejectWithValue }) => {
    try {
      await api.post("/addUserFeedback", feedback);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Analyze Reading Assessment
export const getReadingAssessmentAnalysis = createAsyncThunk(
  "analysis/readingAssessmentAnalysis",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await api.post("/analyzeReadingAssessment", reqData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Analyze Listening Assessment
export const getListeningAssessmentAnalysis = createAsyncThunk(
  "analysis/listeningAssessmentAnalysis",
  async (answers, { rejectWithValue }) => {
    try {
      const response = await api.post("/analyzeListeningAssessment", answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Analyze Grammar Assessment
export const getGrammarAssessmentAnalysis = createAsyncThunk(
  "analysis/grammarAssessmentAnalysis",
  async (answers, { rejectWithValue }) => {
    try {
      const response = await api.post("/analyzeGrammarAssessment", answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Analyze Vocabulary Assessment
export const getVocabularyAssessmentAnalysis = createAsyncThunk(
  "analysis/vocabularyAssessmentAnalysis",
  async (answers, { rejectWithValue }) => {
    try {
      const response = await api.post("/analyzeVocabularyAssessment", answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Analyze Speaking Assessment
export const getSpeakingAssessmentAnalysis = createAsyncThunk(
  "analysis/speakingAssessmentAnalysis",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await api.post("/analyzeSpeakingAssessment", reqData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Action: Get Each Total Assessment Count
export const getEachTotalAssessmentCount = createAsyncThunk(
  "operation/getEachTotalAssessmentCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getEachAssessmentCount");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
