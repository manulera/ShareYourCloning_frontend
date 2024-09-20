import { useState } from 'react';
import axios from 'axios';
import { useStore } from 'react-redux';
import useBackendRoute from '../../../../hooks/useBackendRoute';
import { selectedRegion2SequenceLocation } from '../../../../utils/selectedRegionUtils';
import error2String from '../../../../utils/error2String';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

export function usePrimerDesign(designType, nbSequences) {
  const [primers, setPrimers] = useState([]);
  const [rois, setRois] = useState(Array(nbSequences).fill(null));
  const [error, setError] = useState('');
  const store = useStore();
  const backendRoute = useBackendRoute();

  const onSelectRegion = (index, allowSinglePosition = false) => {
    const selectedRegion = store.getState().cloning.mainSequenceSelection;
    const { caretPosition } = selectedRegion;
    if (caretPosition === undefined) {
      setRois((c) => changeValueAtIndex(c, index, null));
      return 'You have to select a region in the sequence editor!';
    }
    if (caretPosition === -1) {
      setRois((c) => changeValueAtIndex(c, index, selectedRegion));
      return '';
    }
    if (allowSinglePosition) {
      setRois((c) => changeValueAtIndex(c, index, selectedRegion));
      return '';
    }
    setRois((c) => changeValueAtIndex(c, index, null));
    return 'Select a region (not a single position) to amplify';
  };

  const designPrimers = async (
    sequenceIds,
    locations,
    params,
    fragmentOrientations,
  ) => {
    const { cloning: { entities } } = store.getState();

    let requestData;
    if (designType === 'gibson_assembly') {
      requestData = sequenceIds.map((id, index) => ({
        sequence: entities.find((e) => e.id === id),
        location: selectedRegion2SequenceLocation(locations[index]),
        forward_orientation: fragmentOrientations[index] === 'forward',
      }));
    } else if (designType === 'homologous_recombination') {
      const [pcrTemplateId, homologousRecombinationTargetId] = sequenceIds;
      requestData = {
        pcr_template: {
          sequence: entities.find((e) => e.id === pcrTemplateId),
          location: selectedRegion2SequenceLocation(locations[0]),
          orientation: fragmentOrientations[0],
        },
        homologous_recombination_target: {
          sequence: entities.find((e) => e.id === homologousRecombinationTargetId),
          location: selectedRegion2SequenceLocation(locations[1]),
        },
      };
    }

    const url = backendRoute(`/primer_design/${designType}`);

    try {
      const resp = await axios.post(url, requestData, { params });
      setError('');
      const newPrimers = designType === 'gibson_assembly' ? resp.data.primers : [resp.data.forward_primer, resp.data.reverse_primer];
      setPrimers(newPrimers);
      return false;
    } catch (thrownError) {
      const errorMessage = error2String(thrownError);
      setError(errorMessage);
      return true;
    }
  };

  return { primers, error, rois, designPrimers, setPrimers, onSelectRegion };
}
