import { useStore } from 'react-redux';
import { updateEditor, addAlignment } from '@teselagen/ove';
import axios from 'axios';
import { getPCRPrimers, getPrimerLinks } from '../store/cloning_utils';
import { getJsonFromAb1Base64 } from '../utils/sequenceParsers';
import useBackendRoute from './useBackendRoute';

export default function useStoreEditor() {
  const store = useStore();

  const backendRoute = useBackendRoute();

  const updateStoreEditor = async (editorName, id, selectionLayer = {}) => {
    if (id === null) {
      // if id is null and selectionLayer is empty, clear the sequenceData
      if (Object.keys(selectionLayer).length === 0) {
        updateEditor(store, editorName, { sequenceData: {}, selectionLayer });
      } else {
        updateEditor(store, editorName, { selectionLayer });
      }
    } else {
      // otherwise, update the sequenceData with the new id
      const { cloning } = store.getState();
      const { teselaJsonCache } = cloning;
      const sequenceData = { ...teselaJsonCache[id] };
      const entity = cloning.entities.find((e) => e.id === id);
      const entityWithoutSequencing = { ...entity };
      delete entityWithoutSequencing.sequencing;
      const linkedPrimers = getPrimerLinks(cloning, id);
      const pcrPrimers = getPCRPrimers(cloning, id);

      const { sequencing } = cloning.entities.find((e) => e.id === id);
      let panelsShown = [];
      if (sequencing) {
        const parsedSequence = await getJsonFromAb1Base64(sequencing[0].file_content);
        const resp = await axios.post(backendRoute('align_sanger'), { sequence: entityWithoutSequencing, trace: parsedSequence.sequence });
        const alignment = resp.data;

        addAlignment(store, {
          id: 'simpleAlignment',
          alignmentType: 'Simple Sequence Alignment',
          name: 'My Alignment',
          // set the visibilities of the annotations you'd like to see
          alignmentAnnotationVisibility: {
            features: true,
            parts: true,
            translations: true,
          },
          // set the tracks you'd like to see
          alignmentTracks: [
            {
              // each track has a sequenceData and an alignmentData property (both are teselagen sequenceData objects)
              sequenceData,
              alignmentData: {
                // the alignmentData just needs the sequence
                sequence: alignment[0],
              },
            },
            //
            {
              sequenceData: {
                sequence: parsedSequence.sequence,
              },
              alignmentData: {
                sequence: alignment[1],
              },
            },
          ],
        });
        panelsShown = [[
          ...store.getState().VectorEditor.mainEditor.panelsShown[0],
          {
            id: 'simpleAlignment',
            type: 'alignment',
            name: 'Alignments',
            active: true,
            isFullscreen: false,
          },
        ]];
      }
      linkedPrimers.forEach((p) => { p.color = 'lightblue'; });
      sequenceData.primers = sequenceData.primers.concat([...linkedPrimers, ...pcrPrimers]);
      updateEditor(store, editorName, { sequenceData, selectionLayer, panelsShown });
    }
  };

  return { updateStoreEditor };
}
