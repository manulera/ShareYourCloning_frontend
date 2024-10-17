import { useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { getPCRPrimers, getPrimerLinks } from '../store/cloning_utils';

export default function useStoreEditor() {
  const store = useStore();

  const updateStoreEditor = (editorName, id, selectionLayer = {}) => {
    if (id === null) {
      // if id is null, clear the sequenceData
      updateEditor(store, editorName, { sequenceData: {}, selectionLayer });
    } else {
      // otherwise, update the sequenceData with the new id
      const { cloning } = store.getState();
      const { teselaJsonCache } = cloning;
      const sequenceData = { ...teselaJsonCache[id] };
      const linkedPrimers = getPrimerLinks(cloning, id);
      const pcrPrimers = getPCRPrimers(cloning, id);
      linkedPrimers.forEach((p) => { p.color = 'lightblue'; });
      sequenceData.primers = sequenceData.primers.concat([...linkedPrimers, ...pcrPrimers]);
      updateEditor(store, editorName, { sequenceData, selectionLayer });
    }
  };

  return { updateStoreEditor };
}
