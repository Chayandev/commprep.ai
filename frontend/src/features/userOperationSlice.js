import { createSlice } from "@reduxjs/toolkit";
import {
  addUserFeedback,
  getAllGrammarAssessments,
  getAllListeningAssessments,
  getAllReadingAssessments,
  getAllSpeakingAssessments,
  getAllVocabularyAssessments,
  getEachTotalAssessmentCount,
} from "../../actions/user.actions.js";

const initialState = {
  isProcessing: false,
  assessments: null,
  selectedAssessmentIndex: -1,
  message: null,
  totalAssessmentCount: null,
  showCompleted: true,
  difficulty: "All",
  filteredAssessments: null,
};

const filterAssessments = (state) => {
  state.filteredAssessments = state.assessments.filter(
    (assessment) =>
      (state.difficulty === "All" ||
        assessment.difficulty === state.difficulty.toLowerCase()) &&
      (state.showCompleted || !assessment.isCompleted)
  );
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
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;

      //filter the assessment based on difffculty
      filterAssessments(state);
    },
    setShowCompleted: (state, _) => {
      state.showCompleted = !state.showCompleted;
      filterAssessments(state);
    },
  },
  extraReducers: (builder) => {
    // Handle pending, fulfilled, and rejected states for any assessment
    const handlePending = (state) => {
      state.isProcessing = true;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
      state.filteredAssessments = null;
    };

    const handleFulfilled = (state, action) => {
      state.isProcessing = false;
      state.assessments = action.payload?.data;
      state.selectedAssessmentIndex = -1;
      state.showCompleted = true;
      state.difficult = "All";
      state.filteredAssessments = action.payload?.data;
    };

    const handleRejected = (state) => {
      state.isProcessing = false;
      state.assessments = null;
      state.selectedAssessmentIndex = -1;
      state.filteredAssessments = null;
    };

    // Handle reading assessments
    builder.addCase(getAllReadingAssessments.pending, (state) =>
      handlePending(state)
    );
    builder.addCase(getAllReadingAssessments.fulfilled, (state, action) =>
      handleFulfilled(state, action)
    );
    builder.addCase(getAllReadingAssessments.rejected, (state) =>
      handleRejected(state)
    );

    // Handle listening assessments
    builder.addCase(getAllListeningAssessments.pending, (state) =>
      handlePending(state)
    );
    builder.addCase(getAllListeningAssessments.fulfilled, (state, action) =>
      handleFulfilled(state, action)
    );
    builder.addCase(getAllListeningAssessments.rejected, (state) =>
      handleRejected(state)
    );

    // Handle grammar assessments
    builder.addCase(getAllGrammarAssessments.pending, (state) =>
      handlePending(state)
    );
    builder.addCase(getAllGrammarAssessments.fulfilled, (state, action) =>
      handleFulfilled(state, action)
    );
    builder.addCase(getAllGrammarAssessments.rejected, (state) =>
      handleRejected(state)
    );

    // Handle vocabulary assessments
    builder.addCase(getAllVocabularyAssessments.pending, (state) =>
      handlePending(state)
    );
    builder.addCase(getAllVocabularyAssessments.fulfilled, (state, action) =>
      handleFulfilled(state, action)
    );
    builder.addCase(getAllVocabularyAssessments.rejected, (state) =>
      handleRejected(state)
    );

    // Handle speaking assessments
    builder.addCase(getAllSpeakingAssessments.pending, (state) =>
      handlePending(state)
    );
    builder.addCase(getAllSpeakingAssessments.fulfilled, (state, action) =>
      handleFulfilled(state, action)
    );
    builder.addCase(getAllSpeakingAssessments.rejected, (state) =>
      handleRejected(state)
    );

    // Add user feedback reducers
    builder.addCase(addUserFeedback.pending, (state, _) => {
      state.isProcessing = true;
      state.message = null;
    });
    builder.addCase(addUserFeedback.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.message = action.payload?.data;
    });
    builder.addCase(addUserFeedback.rejected, (state) => {
      state.isProcessing = false;
      state.message = null;
    });

    // Get each total assessments count
    builder.addCase(getEachTotalAssessmentCount.pending, (state) => {
      state.isProcessing = true;
      state.totalAssessmentCount = null;
    });
    builder.addCase(getEachTotalAssessmentCount.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.totalAssessmentCount = action.payload?.data;
    });
    builder.addCase(getEachTotalAssessmentCount.rejected, (state) => {
      state.isProcessing = false;
      state.totalAssessmentCount = null;
    });
  },
});

// Export actions
export const {
  selectAssessment,
  moveNextAssessment,
  setShowCompleted,
  setDifficulty,
} = userOperationSlice.actions;
export default userOperationSlice.reducer;
