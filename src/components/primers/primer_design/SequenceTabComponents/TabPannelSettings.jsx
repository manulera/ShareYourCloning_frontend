import React from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import StepNavigation from './StepNavigation';
import TabPanel from '../../../navigation/TabPanel';
import PrimerSettingsForm from './PrimerSettingsForm';
import PrimerSpacerForm from './PrimerSpacerForm';
import OrientationPicker from './OrientationPicker';
import { usePrimerDesign } from './PrimerDesignContext';
import RestrictionSpacerForm from './RestrictionSpacerForm';

function TabPannelSettings() {
  const { templateSequenceIds, designType, selectedTab, sequenceIds, circularAssembly, onCircularAssemblyChange, designPrimers, primers, primerDesignSettings, submissionPreventedMessage } = usePrimerDesign();
  return (
    <TabPanel value={selectedTab} index={sequenceIds.length}>
      <Box sx={{ width: '80%', margin: 'auto' }}>
        <PrimerSettingsForm {...primerDesignSettings} />
        <Box sx={{ mt: 2 }}>
          {designType === 'gibson_assembly' && <FormLabel>Fragment orientation</FormLabel>}
          {templateSequenceIds.map((id, index) => (
            <OrientationPicker
              key={id}
              id={id}
              index={index}
            />
          ))}
        </Box>
        <RestrictionSpacerForm />
        <PrimerSpacerForm />
        {designType === 'gibson_assembly' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControl>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={circularAssembly}
                    onChange={onCircularAssemblyChange}
                    name="circular-assembly"
                  />
                    )}
                label="Circular assembly"
              />
            </FormControl>
          </Box>
        )}

      </Box>
      <StepNavigation
        onStepCompletion={designPrimers}
        stepCompletionText="Design primers"
        nextDisabled={primers.length === 0}
        stepCompletionToolTip={submissionPreventedMessage}
        allowStepCompletion={submissionPreventedMessage === ''}
      />
    </TabPanel>
  );
}

export default TabPannelSettings;
