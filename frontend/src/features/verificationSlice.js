import { createSlice } from "@reduxjs/toolkit";
import { verifyUserEmail } from "../../actions/user.actions";

const initialState = {
  isProcessing: false,
  verificationError: null,
};

const verificationSlice = createSlice({
  name: "verify",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(verifyUserEmail.pending, (state, _) => {
      state.isProcessing = true;
      state.verificationError = null;
    }),
      builder.addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.verificationError = null;
      }),
      builder.addCase(verifyUserEmail.rejected, (state, action) => {
        state.isProcessing = false;
        state.verificationError = action.payload;
      });
  },
});

export default verificationSlice.reducer;
