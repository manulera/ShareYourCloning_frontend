import { batch } from 'react-redux';
import axios from 'axios';
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
  // Pretty print json and add a newline at the end
  const json = `${JSON.stringify(output, null, 2)}\n`;
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

export const uploadToELabFTWThunk = (title, categoryId, apiKey) => async (dispatch, getState) => {
  const state = getState();
  const { primers } = state.primers;
  const { description, network, sources, entities } = state.cloning;
  const usedPrimersIds = sources.filter((s) => s.type === 'PCR').map((s) => [s.forward_primer, s.reverse_primer]).flat();
  const primersToUpload = primers.filter((p) => usedPrimersIds.includes(p.id));

  const eLabFTWSources = sources.filter((source) => source.type === 'file' && source.info.file_from === 'eLabFTW');
  const links2add = eLabFTWSources.map((source) => source.info.item_id);
  console.log(links2add);

  const history = {
    sources, primersToUpload,
  };
  if (network.length !== 1 || network[0].entity === null) {
    throw new Error('Only one final product should be present');
  }
  const entity2export = entities.find((e) => e.id === network[0].entity.id);
  console.log(entity2export.sequence.file_content);

  // Create item
  const createdItemResponse = await axios.post(
    'https://elab.local:3148/api/v2/items',
    {
      category_id: categoryId,
      tags: [],
    },
    { headers: { Authorization: apiKey } },
  );

  // Normally we would expect to get the item id from the response,
  // but in this case the header is not returned because of CORS,
  // we just use the highest id
  const resp = await axios.get(
    'https://elab.local:3148/api/v2/items',
    { headers: { Authorization: apiKey }, params: { cat: categoryId } },
  );
  const itemId = Math.max(...resp.data.map((item) => item.id));

  // Set the title
  await axios.patch(
    `https://elab.local:3148/api/v2/items/${itemId}`,
    { title },
    { headers: { Authorization: apiKey } },
  );

  const linkToParent = async (childId, parentId) => {
    await axios.post(
      `https://elab.local:3148/api/v2/items/${childId}/items_links/${parentId}`,
      { parent_id: parentId },
      { headers: { Authorization: apiKey } },
    );
  };

  // Link to the parents
  await Promise.all(links2add.map((link) => linkToParent(itemId, link)));

  // Upload the sequence file
  const formData = new FormData();
  const blob = new Blob([entity2export.sequence.file_content], { type: 'application/json' });
  formData.append('file', blob, `${title}.gb`);
  formData.append('comment', 'resource sequence - generated by ShareYourCloning');
  const uploadResponse = await axios.post(
    `https://elab.local:3148/api/v2/items/${itemId}/uploads`,
    formData,
    { headers: { Authorization: apiKey, 'content-type': 'multipart/form-data' } },
  );

  // Upload the history
  const historyBlob = new Blob([JSON.stringify(history)], { type: 'application/json' });
  const historyFormData = new FormData();
  historyFormData.append('file', historyBlob, `${title}_history.json`);
  historyFormData.append('comment', 'history file - generated by ShareYourCloning');
  const historyUploadResponse = await axios.post(
    `https://elab.local:3148/api/v2/items/${itemId}/uploads`,
    historyFormData,
    { headers: { Authorization: apiKey, 'content-type': 'multipart/form-data' } },
  );
};
