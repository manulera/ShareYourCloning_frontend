import { batch } from 'react-redux';
import { cloningActions } from '../store/cloning';
import { primersActions } from '../store/primers';

const { setState: setCloningState, setMainSequenceId, setDescription, revertToInitialState: resetCloning } = cloningActions;
const { setPrimers, revertToInitialState: resetPrimers } = primersActions;

export const downloadStateAsJson = async (entities, sources, description, primers) => {
  // from https://stackoverflow.com/a/55613750/5622322
  const output = {
    sequences: entities, sources, description, primers,
  };
  // json
  const fileName = 'file';
  const json = JSON.stringify(output);
  const blob = new Blob([json], { type: 'application/json' });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportStateThunk = () => async (dispatch, getState) => {
  const state = getState();
  const { entities } = state.cloning;
  const { sources } = state.cloning;
  const { primers } = state.primers;
  const { description } = state.cloning;

  // Use the utility function to download the state as JSON
  downloadStateAsJson(entities, sources, description, primers);
};

export const fileReceivedToJson = (event, callback, onError) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = (eventFileRead) => {
    try {
      const parsed = JSON.parse(eventFileRead.target.result);
      callback(parsed);
    } catch (e) {
      onError('Input file should be a JSON file with the history');
    }
  };
  return reader;
};

export const loadStateThunk = (newState) => async (dispatch, getState) => {
  dispatch(setCloningState({ sources: newState.sources, entities: newState.sequences }));
  dispatch(setPrimers(newState.primers));
  dispatch(setMainSequenceId(null));
  dispatch(setDescription(newState.description));
};

export const resetStateThunk = () => async (dispatch) => {
  batch(() => {
    dispatch(resetCloning());
    dispatch(resetPrimers());
  });
};
