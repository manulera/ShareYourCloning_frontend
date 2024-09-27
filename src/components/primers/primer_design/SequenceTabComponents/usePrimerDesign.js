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
    spacers = [],
  ) => {
    const { cloning: { entities } } = store.getState();

    let requestData;
    if (designType === 'gibson_assembly') {
      requestData = {
        pcr_templates: sequenceIds.map((id, index) => ({
          sequence: entities.find((e) => e.id === id),
          location: selectedRegion2SequenceLocation(locations[index]),
          forward_orientation: fragmentOrientations[index] === 'forward',
        })),
        spacers,
      };
    } else if (designType === 'homologous_recombination') {
      const [pcrTemplateId, homologousRecombinationTargetId] = sequenceIds;
      requestData = {
        pcr_template: {
          sequence: entities.find((e) => e.id === pcrTemplateId),
          location: selectedRegion2SequenceLocation(locations[0]),
          forward_orientation: fragmentOrientations[0] === 'forward',
        },
        homologous_recombination_target: {
          sequence: entities.find((e) => e.id === homologousRecombinationTargetId),
          location: selectedRegion2SequenceLocation(locations[1]),
        },
      };
    } else if (designType === 'restriction_ligation') {
      const [pcrTemplateId] = sequenceIds;
      requestData = {
        pcr_template: {
          sequence: entities.find((e) => e.id === pcrTemplateId),
          location: selectedRegion2SequenceLocation(locations[0]),
          forward_orientation: true,
        },
        spacers,
      };
    }

    const url = backendRoute(`/primer_design/${designType}`);

    try {
      const resp = await axios.post(url, requestData, { params });
      setError('');
      const newPrimers = resp.data.primers;
      setPrimers(newPrimers);
      return false;
    } catch (thrownError) {
      console.log('requestData', requestData);
      console.log('params', params);
      const errorMessage = error2String(thrownError);
      setError(errorMessage);
      return true;
    }
  };

  return { primers, error, rois, designPrimers, setPrimers, onSelectRegion };
}
