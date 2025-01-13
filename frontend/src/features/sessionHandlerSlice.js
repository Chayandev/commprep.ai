import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionExpired: false,
};

const sessionHandlerSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {
    handleSessionExpiry: (state, _) => {
      state.sessionExpired = true;
    },
    handleResetSession: (state, _) => {
      state.sessionExpired = false;
    },
  },
});

// Export actions
export const { handleSessionExpiry, handleResetSession } = sessionHandlerSlice.actions;

// Export reducer
export default sessionHandlerSlice.reducer;
