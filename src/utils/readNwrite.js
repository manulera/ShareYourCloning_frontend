import { batch } from 'react-redux';
import { cloningActions } from '../store/cloning';
import { primersActions } from '../store/primers';
import { submitFileToGoogleDrive } from '../components/GooglePickerFunctions';
import {getIdsOfEntitiesWithoutChildSource} from '../store/cloning_utils';


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

export const submitFileToGoogleDriveAsJSON = async (entities, sources, description, primers, fileNameInput, scriptVars) => {
  // from https://stackoverflow.com/a/55613750/5622322
  const output = {
    sequences: entities, sources, description, primers,
  };
  // json
  const entityNotChildSourceIds = getIdsOfEntitiesWithoutChildSource(sources, entities);
  console.log(entityNotChildSourceIds, 'entityNotChildSourceIds')
  
  if (entityNotChildSourceIds.length === 1) {
  const outputSequence = output.sequences.find((sequence) => entityNotChildSourceIds.includes(sequence.id));
  const outputSequenceForGBFile = outputSequence.sequence;
  console.log(outputSequenceForGBFile, 'outputSequenceForGBFile')

  const fileNameJSON = fileNameInput + '.json';
  console.log(fileNameJSON, 'fileName');
  console.log(output, 'output')
  const jsonString = JSON.stringify(output);

  const fileNameGB = fileNameInput + '.gb';
  const gbString = JSON.stringify(outputSequenceForGBFile);
  console.log(gbString, 'gbString')

  const fileArrayForPostRequestToGoogleDrive = [
    {fileName: fileNameJSON, fileContent: jsonString},
    {fileName: fileNameGB, fileContent: gbString}
  ];


  {scriptVars && fileNameInput && submitFileToGoogleDrive(scriptVars, fileArrayForPostRequestToGoogleDrive);}

} else { 
  console.log('Please select only one sequence without child source to export to GenBank format');
}
};

export const exportGoogleDriveStateThunk = (fileNameInput, scriptVars) => async (dispatch, getState) => {
  const state = getState();
  const { entities } = state.cloning;
  const { sources } = state.cloning;
  const { primers } = state.primers;
  const { description } = state.cloning;

  // Use the utility function to download the state as JSON
  submitFileToGoogleDriveAsJSON(entities, sources, description, primers, fileNameInput, scriptVars);
};

export const exportStateThunk = (downloadStateAsJson) => async (dispatch, getState) => {
  const state = getState();
  const { entities } = state.cloning;
  const { sources } = state.cloning;
  const { primers } = state.primers;
  const { description } = state.cloning;

//entities.find after getting the id of the sequence without chikdrejn. the function tomfisnd id is in team chat.



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
 