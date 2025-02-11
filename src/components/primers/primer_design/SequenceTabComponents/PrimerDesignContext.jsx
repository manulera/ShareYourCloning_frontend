import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import { updateEditor } from '@teselagen/ove';
import { isEqual } from 'lodash-es';
import useBackendRoute from '../../../../hooks/useBackendRoute';
import { selectedRegion2SequenceLocation } from '../../../../utils/selectedRegionUtils';
import error2String from '../../../../utils/error2String';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import { cloningActions } from '../../../../store/cloning';
import usePrimerDesignSettings from './usePrimerDesignSettings';
import { stringIsNotDNA } from '../../../../store/cloning_utils';

function changeValueAtIndex(current, index, newValue) {
  return current.map((_, i) => (i === index ? newValue : current[i]));
}

const PrimerDesignContext = React.createContext();

export function PrimerDesignProvider({ children, designType, sequenceIds, initialPrimerDesignSettings }) {
  const [primers, setPrimers] = useState([]);
  const [rois, setRois] = useState(Array(sequenceIds.length).fill(null));
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sequenceProduct, setSequenceProduct] = useState(null);
  const [fragmentOrientations, setFragmentOrientations] = useState(Array(sequenceIds.length).fill('forward'));
  const [circularAssembly, setCircularAssembly] = useState(false);
  const [spacers, setSpacers] = useState(Array(sequenceIds.length + 1).fill(''));
  const primerDesignSettings = usePrimerDesignSettings(initialPrimerDesignSettings);

  const sequenceNames = useSelector((state) => sequenceIds.map((id) => state.cloning.teselaJsonCache[id].name), isEqual);

  const store = useStore();
  const backendRoute = useBackendRoute();
  const dispatch = useDispatch();
  const { updateStoreEditor } = useStoreEditor();
  const { setMainSequenceId, addPrimersToPCRSource, setCurrentTab } = cloningActions;

  const mainSequenceId = useSelector((state) => state.cloning.mainSequenceId);

  const getSubmissionPreventedMessage = () => {
    if (rois.some((region) => region === null)) {
      return 'Not all regions have been selected';
    } if (!primerDesignSettings.valid) {
      return 'Primer design settings not valid';
    } if (spacers.some((spacer) => stringIsNotDNA(spacer))) {
      return 'Spacer sequences not valid';
    }
    return '';
  };

  const submissionPreventedMessage = getSubmissionPreventedMessage();

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

  const handleFragmentOrientationChange = (index, orientation) => {
    setFragmentOrientations((current) => changeValueAtIndex(current, index, orientation));
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

  const designPrimers = async () => {
    // Validate fragmentOrientations
    fragmentOrientations.forEach((orientation) => {
      if (orientation !== 'forward' && orientation !== 'reverse') {
        throw new Error('Invalid fragment orientation');
      }
    });
    const { cloning: { entities } } = store.getState();
    let requestData;
    let params;
    if (designType === 'gibson_assembly') {
      params = {
        homology_length: primerDesignSettings.homologyLength,
        minimal_hybridization_length: primerDesignSettings.hybridizationLength,
        target_tm: primerDesignSettings.targetTm,
        circular_assembly: circularAssembly,
      };
      requestData = {
        pcr_templates: sequenceIds.map((id, index) => ({
          sequence: entities.find((e) => e.id === id),
          location: selectedRegion2SequenceLocation(rois[index]),
          forward_orientation: fragmentOrientations[index] === 'forward',
        })),
        spacers,
      };
    } else if (designType === 'homologous_recombination') {
      const [pcrTemplateId, homologousRecombinationTargetId] = sequenceIds;
      requestData = {
        pcr_template: {
          sequence: entities.find((e) => e.id === pcrTemplateId),
          location: selectedRegion2SequenceLocation(rois[0]),
          forward_orientation: fragmentOrientations[0] === 'forward',
        },
        homologous_recombination_target: {
          sequence: entities.find((e) => e.id === homologousRecombinationTargetId),
          location: selectedRegion2SequenceLocation(rois[1]),
        },
        spacers,
      };
    } else if (designType === 'simple_pair') {
      const pcrTemplateId = sequenceIds[0];
      requestData = {
        pcr_template: {
          sequence: entities.find((e) => e.id === pcrTemplateId),
          location: selectedRegion2SequenceLocation(rois[0]),
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
      handleNext();
      return false;
    } catch (thrownError) {
      const errorMessage = error2String(thrownError);
      setError(errorMessage);
      return true;
    }
  };

  const addPrimers = () => {
    const pcrSources = store.getState().cloning.sources.filter((source) => source.type === 'PCRSource');
    const usedPCRSources = sequenceIds
      .map((id) => pcrSources.find((source) => source.input.includes(id)))
      .filter((source) => source !== undefined);
    batch(() => {
      usedPCRSources.forEach((pcrSource, index) => {
        dispatch(addPrimersToPCRSource({
          fwdPrimer: primers[index * 2],
          revPrimer: primers[index * 2 + 1],
          sourceId: pcrSource.id,
        }));
      });
      dispatch(setMainSequenceId(null));
      dispatch(setCurrentTab(0));
    });
    setPrimers([]);
    onTabChange(null, 0);
    document.getElementById(`source-${usedPCRSources[0].id}`)?.scrollIntoView();
    updateStoreEditor('mainEditor', null);
  };

  const value = React.useMemo(() => ({
    primers,
    error,
    rois,
    designPrimers,
    setPrimers,
    selectedTab,
    onTabChange,
    setSequenceProduct,
    handleNext,
    handleBack,
    handleSelectRegion,
    sequenceIds,
    fragmentOrientations,
    circularAssembly,
    spacers,
    setFragmentOrientations,
    setCircularAssembly,
    setSpacers,
    handleFragmentOrientationChange,
    sequenceNames,
    primerDesignSettings,
    submissionPreventedMessage,
    addPrimers,
  }), [
    primers,
    error,
    rois,
    designPrimers,
    setPrimers,
    selectedTab,
    onTabChange,
    setSequenceProduct,
    handleNext,
    handleBack,
    handleSelectRegion,
    sequenceIds,
    fragmentOrientations,
    circularAssembly,
    spacers,
    setFragmentOrientations,
    setCircularAssembly,
    setSpacers,
    handleFragmentOrientationChange,
    sequenceNames,
    primerDesignSettings,
    submissionPreventedMessage,
    addPrimers,
  ]);

  return (
    <PrimerDesignContext.Provider value={value}>
      {children}
    </PrimerDesignContext.Provider>
  );
}

export const usePrimerDesign = () => React.useContext(PrimerDesignContext);
