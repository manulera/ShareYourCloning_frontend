import { createSlice } from "@reduxjs/toolkit";
// const createSlice = require("@reduxjs/toolkit").createSlice;

const initialState = {
  mainSequenceId: null,
  nextUniqueId: 2,
  sources: [
    {
      id: 1,
      input: [],
      output: null,
      type: null,
      kind: 'source',
    },
  ],
  entities: [],
};

/* eslint-disable no-param-reassign */
const reducer = {
  setMainSequenceId(state, action) {
    state.mainSequenceId = action.payload;
  },

  addEmptySource(state, action) {
    const inputEntitiesIds = action.payload;
    const { sources } = state;
    state.nextUniqueId += 1;
    sources.push({
      id: state.nextUniqueId,
      input: inputEntitiesIds,
      output: null,
      type: null,
      kind: 'source',
    });
  },

  addEntityAndItsSource(state, action) {
    const { newEntity, newSource } = action.payload;
    const { entities, sources } = state;
    state.nextUniqueId += 1;
    newEntity.id = state.nextUniqueId;
    newSource.output = state.nextUniqueId;
    entities.push(newEntity);
    // Replace the source with the new one
    const source = sources.find((s) => s.id === newSource.id);
    Object.assign(source, newSource);
  },

  updateSource(state, action) {
    const { newSource } = action.payload;
    const { sources } = state;
    const source = sources.find((s) => s.id === newSource.id);
    Object.assign(source, newSource);
  },

  deleteSourceAndItsChildren(state, action) {
    const { sourceId } = action.payload;
    const { sources, entities } = state;
    const sources2delete = [];
    const entities2delete = [];
    let currentSource = sources.find((s) => s.id === sourceId);
    while (currentSource !== undefined) {
      sources2delete.push(currentSource.id);
      if (currentSource.output === null) { break; }
      entities2delete.push(currentSource.output);
      currentSource = sources.find((ss) => ss.input.includes(currentSource.output));
    }
    state.sources = sources.filter((s) => !sources2delete.includes(s.id));
    state.entities = entities.filter((e) => !entities2delete.includes(e.id));
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
