import { createSlice } from "@reduxjs/toolkit";
import {
  addUserFeedback,
  getAllGrammarAssessments,
  getAllListeningAssessments,
  getAllReadingAssessments,
} from "../../actions/user.actions.js";

const initialState = {
  isProcessing: false,
  assessments: null,
  selectedAssessmentIndex: -1,
  message: null,
};

const userOperationSlice = createSlice({
  name: "operation",
  initialState: initialState,
  reducers: {
    selectAssessment: (state, action) => {
      state.selectedAssessmentIndex = action.payload; // Set the current assessment index to the selected index
    },
    moveNextAssessment: (state, _) => {
      console.log(state.selectedAssessmentIndex);

      console.log(state.selectedAssessmentIndex);
      state.selectedAssessmentIndex += 1; // Increment index if not at the last assessment
    },
  },
  extraReducers: (builder) => {
    //fetching all reading assessments
    builder.addCase(getAllReadingAssessments.pending, (state, _) => {
      state.isProcessing = true;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
    });
    builder.addCase(getAllReadingAssessments.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.assessments = action.payload?.data;
      state.selectedAssessmentIndex = -1;
    });
    builder.addCase(getAllReadingAssessments.rejected, (state, _) => {
      state.isProcessing = false;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
    });

    //fetching all listening assessments
    builder.addCase(getAllListeningAssessments.pending, (state, _) => {
      state.isProcessing = true;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
    });
    builder.addCase(getAllListeningAssessments.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.assessments = action.payload?.data;
      state.selectedAssessmentIndex = -1;
    });
    builder.addCase(getAllListeningAssessments.rejected, (state, _) => {
      state.isProcessing = false;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
    });

    //fetching all grammar assessments
    builder.addCase(getAllGrammarAssessments.pending, (state, _) => {
      state.isProcessing = true;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
    });
    builder.addCase(getAllGrammarAssessments.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.assessments = action.payload?.data;
      state.selectedAssessmentIndex = -1;
    });
    builder.addCase(getAllGrammarAssessments.rejected, (state, _) => {
      state.isProcessing = false;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
    });

    //add user feedbacks
    builder.addCase(addUserFeedback.pending, (state, _) => {
      state.isProcessing = true;
      state.message = null;
    });
    builder.addCase(addUserFeedback.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.message = action.payload?.data;
    });
    builder.addCase(addUserFeedback.rejected, (state, action) => {
      state.isProcessing = false;
      state.message = null;
    });
  },
});

// Export actions
export const { selectAssessment, moveNextAssessment } =
  userOperationSlice.actions;
export default userOperationSlice.reducer;
