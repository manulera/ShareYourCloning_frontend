import { useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { convertToTeselaJson } from '../utils/sequenceParsers';

export default function useMainEditor() {
  const store = useStore();

  const updateMainEditor = (id) => {
    if (id === null) {
      // if id is null, clear the sequenceData
      updateEditor(store, 'mainEditor', { sequenceData: null, selectionLayer: {} });
    } else {
      // otherwise, update the sequenceData with the new id
      const { cloning: { entities } } = store.getState();
      const entity = entities.find((e) => e.id === id);
      const sequenceData = entity === undefined ? undefined : convertToTeselaJson(entity);
      updateEditor(store, 'mainEditor', { sequenceData, selectionLayer: {} });
    }
  };

  return { updateMainEditor };
}
