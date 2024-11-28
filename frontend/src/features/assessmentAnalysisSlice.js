import { createSlice } from "@reduxjs/toolkit";
import {
  getGrammarAssessmentAnalysis,
  getListeningAssessmentAnalysis,
  getReadingAssessmentAnslysis,
  getVocabularyAssessmentAnalysis,
} from "../../actions/user.actions";

const initialState = {
  isAnalyzing: false,
  result: null,
};

const assessmentAnalysisSlice = createSlice({
  name: "assessmentAnalysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Reading Assessment Analysis
    builder.addCase(getReadingAssessmentAnslysis.pending, (state) => {
      state.isAnalyzing = true;
      state.result = null;
    });
    builder.addCase(getReadingAssessmentAnslysis.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.result = action.payload?.data;
    });
    builder.addCase(getReadingAssessmentAnslysis.rejected, (state) => {
      state.isAnalyzing = false;
      state.result = null;
    });

    // Listening Assessment Analysis
    builder.addCase(getListeningAssessmentAnalysis.pending, (state) => {
      state.isAnalyzing = true;
      state.result = null;
    });
    builder.addCase(
      getListeningAssessmentAnalysis.fulfilled,
      (state, action) => {
        state.isAnalyzing = false;
        state.result = action.payload?.data;
      }
    );
    builder.addCase(getListeningAssessmentAnalysis.rejected, (state) => {
      state.isAnalyzing = false;
      state.result = null;
    });

    // Grammar Assessment Analysis
    builder.addCase(getGrammarAssessmentAnalysis.pending, (state) => {
      state.isAnalyzing = true;
      state.result = null;
    });
    builder.addCase(getGrammarAssessmentAnalysis.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.result = action.payload?.data;
    });
    builder.addCase(getGrammarAssessmentAnalysis.rejected, (state) => {
      state.isAnalyzing = false;
      state.result = null;
    });

    //vocabulary Assessment Anlysis
    builder.addCase(getVocabularyAssessmentAnalysis.pending, (state) => {
      state.isAnalyzing = true;
      state.result = null;
    });
    builder.addCase(
      getVocabularyAssessmentAnalysis.fulfilled,
      (state, action) => {
        state.isAnalyzing = false;
        state.result = action.payload?.data;
      }
    );
    builder.addCase(getVocabularyAssessmentAnalysis.rejected, (state) => {
      state.isAnalyzing = false;
      state.result = null;
    });
  },
});

export default assessmentAnalysisSlice.reducer;
