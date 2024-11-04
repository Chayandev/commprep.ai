import { createSlice } from "@reduxjs/toolkit";
import { getReadingAssessmentAnslysis } from "../../actions/user.actions";

const initialState = {
  isAnalyzing: false,
  result: null,
};

const assessmentAnalysisSlice = createSlice({
  name: "assessmentAnalysis",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //analysis of reading assessments

    builder.addCase(getReadingAssessmentAnslysis.pending, (state, _) => {
      state.isAnalyzing = true;
      state.result = null;
    });
    builder.addCase(getReadingAssessmentAnslysis.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.result = action.payload?.data;
    });
    builder.addCase(getReadingAssessmentAnslysis.rejected, (state, _) => {
      state.isAnalyzing = false;
      state.result = null;
    });
  },
});

export default assessmentAnalysisSlice.reducer;
