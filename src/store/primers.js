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
  addPrimers(state, action) {
    const newPrimers = action.payload;
    const { primers } = state;
    state.nextUniqueId += newPrimers.length;
    primers.push(...newPrimers.map((p, i) => ({ ...p, id: state.nextUniqueId - newPrimers.length + i })));
  },

  setPrimers(state, action) {
    const primers = action.payload;
    state.primers = primers;
  },

  deletePrimer(state, action) {
    const primerId = action.payload;
    state.primers = state.primers.filter((p) => p.id !== primerId);
  },

  updatePrimer(state, action) {
    const newPrimer = action.payload;
    const { primers } = state;
    const primer = primers.find((p) => p.id === newPrimer.id);
    Object.assign(primer, newPrimer);
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
