import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import useBackendRoute from '../../../../hooks/useBackendRoute';
import { selectedRegion2SequenceLocation } from '../../../../utils/selectedRegionUtils';
import error2String from '../../../../utils/error2String';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import { cloningActions } from '../../../../store/cloning';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

export function usePrimerDesign(designType, sequenceIds) {
  const [primers, setPrimers] = useState([]);
  const [rois, setRois] = useState(Array(sequenceIds.length).fill(null));
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sequenceProduct, setSequenceProduct] = useState(null);

  const store = useStore();
  const backendRoute = useBackendRoute();
  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();
  const { setMainSequenceId } = cloningActions;

  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);

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

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue < sequenceIds.length) {
      updateStoreEditor('mainEditor', sequenceIds[newValue]);
      dispatch(setMainSequenceId(sequenceIds[newValue]));
    } else if (newValue === sequenceIds.length) {
      updateEditor(store, 'mainEditor', { sequenceData: sequenceProduct || '', selectionLayer: {} });
    } else {
      updateStoreEditor('mainEditor', null);
    }
  };

  const handleNext = () => {
    onTabChange(null, selectedTab + 1);
  };

  const handleBack = () => {
    onTabChange(null, selectedTab - 1);
  };

  const handleSelectRegion = (index, allowSinglePosition = false) => {
    const regionError = onSelectRegion(index, allowSinglePosition);
    if (!regionError) {
      handleNext();
    }
    return regionError;
  };

  // Focus on the right sequence when changing tabs
  useEffect(() => {
    // Focus on the correct sequence
    const mainSequenceIndex = sequenceIds.indexOf(mainSequenceId);
    if (mainSequenceIndex !== -1) {
      setSelectedTab(mainSequenceIndex);
    }
  }, [sequenceIds, mainSequenceId]);

  // Update the sequence product in the editor if in the last tab
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedTab === sequenceIds.length) {
        updateEditor(store, 'mainEditor', { sequenceData: sequenceProduct || {} });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [sequenceProduct, store]);

  const designPrimers = async (
    locations,
    params,
    fragmentOrientations,
    spacers = [],
  ) => {
    // Validate fragmentOrientations
    fragmentOrientations.forEach((orientation) => {
      if (orientation !== 'forward' && orientation !== 'reverse') {
        throw new Error('Invalid fragment orientation');
      }
    });
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
        spacers,
      };
    } else if (designType === 'simple_pair') {
      const pcrTemplateId = sequenceIds[0];
      requestData = {
        pcr_template: {
          sequence: entities.find((e) => e.id === pcrTemplateId),
          location: selectedRegion2SequenceLocation(locations[0]),
          forward_orientation: fragmentOrientations[0] === 'forward',
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
      const errorMessage = error2String(thrownError);
      setError(errorMessage);
      return true;
    }
  };

  return { primers, error, rois, designPrimers, setPrimers, selectedTab, onTabChange, setSequenceProduct, setSelectedTab, handleNext, handleBack, handleSelectRegion };
}
