import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nextUniqueId: 3,
  primers: [
    { id: 1, name: 'fwd', sequence: 'gatctcgccataaaagacag' },
    { id: 2, name: 'rvs', sequence: 'ttaacaaagcgactataagt' },
  ],
};

/* eslint-disable no-param-reassign */
const reducer = {
  addPrimer(state, action) {
    const newPrimer = action.payload;
    const { primers } = state;
    newPrimer.id = state.nextUniqueId;
    state.nextUniqueId += 1;
    primers.push(newPrimer);
  },

  setPrimers(state, action) {
    const primers = action.payload;
    state.primers = primers;
  },

  deletePrimer(state, action) {
    const primerId = action.payload;
    state.primers = state.primers.filter((p) => p.id !== primerId);
  },

};

/* eslint-enable no-param-reassign */

const primersSlice = createSlice({
  name: 'primers',
  initialState,
  reducers: reducer,
});

export const primersActions = primersSlice.actions;
export default primersSlice.reducer;
