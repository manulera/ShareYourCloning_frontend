import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainSequenceId: null,
}

/* eslint-disable no-param-reassign */
const reducer = {
  setMainSequenceId(state, action) {
    state.mainSequenceId = action.payload;
  },

};
/* eslint-enable no-param-reassign */

const cloningSlice = createSlice({
  name: 'cloning',
  initialState,
  reducers: reducer,
});

export const cloningActions = cloningSlice.actions;
export default cloningSlice.reducer;
