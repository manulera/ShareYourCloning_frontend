import React from 'react';
import { Alert, FormControl, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import TabPanel from './TabPanel';
import StepNavigation from './StepNavigation';
import { selectedRegion2String } from '../../../../utils/selectedRegionUtils';
import GatewayRoiSelect from './GatewayRoiSelect';

function TabPanelSelectRoi({ step,
  index, selectedTab, handleSelectRegion,
  handleBack, handleNext, templateSequencesIds, rois,
  setSpacers,
}) {
  const [error, setError] = React.useState('');
  const editorHasSelection = useSelector((state) => state.cloning.mainSequenceSelection.caretPosition !== undefined);
  const id = templateSequencesIds[index];
  const {
    description = `Select the fragment of sequence ${id} to be amplified in the editor and click "Choose region"`,
    inputLabel = `Amplified region (sequence ${id})`,
    allowSinglePosition = false,
    mode = 'editor',
  } = step;

  return (
    <TabPanel value={selectedTab} index={index}>
      <Alert severity="info">{description}</Alert>
      {error && (<Alert severity="error">{error}</Alert>)}
      {mode === 'editor' && (
      <FormControl sx={{ py: 2 }}>
        <TextField
          label={inputLabel}
          value={selectedRegion2String(rois[index])}
          disabled
        />
      </FormControl>
      )}
      {mode === 'gateway' && (
        <GatewayRoiSelect id={id} setSpacers={setSpacers} />
      )}
      <StepNavigation
        handleBack={handleBack}
        handleNext={handleNext}
        isFirstStep={index === 0}
        nextDisabled={(index === templateSequencesIds.length - 1) && rois.some((region) => region === null)}
        nextToolTip="You must select all regions before proceeding"
        allowStepCompletion={editorHasSelection}
        stepCompletionText="Choose region"
        stepCompletionToolTip="Select a region in the editor"
        onStepCompletion={() => handleSelectRegion(index, allowSinglePosition)}
      />

    </TabPanel>
  );
}

export default TabPanelSelectRoi;
