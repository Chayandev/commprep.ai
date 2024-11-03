import { createSlice } from "@reduxjs/toolkit";
import { getAllReadingAssessments } from "../../actions/user.actions.js";

const initialState = {
  isProcessing: false,
  assessments: null,
  selectedAssessmentIndex: -1,
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
    });
    builder.addCase(getAllReadingAssessments.fulfilled, (state, action) => {
      state.isProcessing = false;
      state.assessments = action.payload?.data;
    });
    builder.addCase(getAllReadingAssessments.rejected, (state, _) => {
      state.isProcessing = false;
      state.assessments = null;
    });

   
  },
});

// Export actions
export const { selectAssessment, moveNextAssessment } =
  userOperationSlice.actions;
export default userOperationSlice.reducer;
