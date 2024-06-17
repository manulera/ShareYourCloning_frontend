import { useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { convertToTeselaJson } from '../utils/sequenceParsers';

export default function useStoreEditor() {
  const store = useStore();

  const updateStoreEditor = (editorName, id, selectionLayer = {}) => {
    if (id === null) {
      // if id is null, clear the sequenceData
      updateEditor(store, editorName, { sequenceData: {}, selectionLayer });
    } else {
      // otherwise, update the sequenceData with the new id
      const { cloning: { entities } } = store.getState();
      const entity = entities.find((e) => e.id === id);
      const sequenceData = entity === undefined ? undefined : convertToTeselaJson(entity);
      updateEditor(store, editorName, { sequenceData, selectionLayer });
    }
  };

  return { updateStoreEditor };
}
