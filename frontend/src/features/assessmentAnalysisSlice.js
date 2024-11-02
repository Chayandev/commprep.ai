import { createSlice } from "@reduxjs/toolkit";
import { getReadingAssesmentAnslysis } from "../../actions/user.actions";

const initialState = {
  isAnalyzing: false,
  result: null,
};

const assesmentAnalysisSlice = createSlice({
  name: "assessmestAnalysis",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //analysis of reading assessments

    builder.addCase(getReadingAssesmentAnslysis.pending, (state, _) => {
      state.isAnalyzing = true;
      state.result = null;
    });
    builder.addCase(getReadingAssesmentAnslysis.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.result = action.payload?.data;
    });
    builder.addCase(getReadingAssesmentAnslysis.rejected, (state, _) => {
      state.isAnalyzing = false;
      state.result = null;
    });
  },
});

export default assesmentAnalysisSlice.reducer;
