import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFullScreenLayout: false,
};

const layoutChangerSlice = createSlice({
  name: "layoutChanger",
  initialState: initialState,
  reducers: {
    changeLayout: (state, _) => {
      state.isFullScreenLayout = !state.isFullScreenLayout;
    },
  },
});

export const { changeLayout } = layoutChangerSlice.actions;
export default layoutChangerSlice.reducer;