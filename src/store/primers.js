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
    // Ids are unique and all are positive integers
    const ids = primers.map((p) => p.id);
    if (ids.some((id) => id < 1 || !Number.isInteger(id))) {
      throw new Error('Some ids are not positive integers');
    }
    // None should be repeated
    if (new Set(ids).size !== ids.length) {
      throw new Error('Repeated ids in the primers');
    }
    state.nextUniqueId = Math.max(...primers.map((s) => s.id)) + 1;
    state.primers = primers;
  },

  deletePrimer(state, action) {
    const primerId = action.payload;
    state.primers = state.primers.filter((p) => p.id !== primerId);
  },

  editPrimer(state, action) {
    const editedPrimer = action.payload;
    const targetPrimer = state.primers.find((p) => p.id === editedPrimer.id);
    if (!targetPrimer) {
      throw new Error('Primer not found');
    }
    Object.assign(targetPrimer, editedPrimer);
  },

  revertToInitialState(state) {
    Object.assign(state, initialState);
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
