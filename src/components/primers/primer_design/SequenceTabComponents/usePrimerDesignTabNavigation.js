import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useStoreEditor from '../../../../hooks/useStoreEditor';
import { cloningActions } from '../../../../store/cloning';

const { setMainSequenceId } = cloningActions;

function usePrimerDesignTabNavigation() {
  const updateStoreEditor = useStoreEditor();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
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

  return {
    onTabChange,
    handleNext,
    handleBack,
  };
}
