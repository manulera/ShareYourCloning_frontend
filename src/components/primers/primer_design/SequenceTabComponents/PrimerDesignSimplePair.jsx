import React from 'react';
import { Box } from '@mui/material';

import PrimerDesignStepper from './PrimerDesignStepper';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import { PrimerDesignProvider } from './PrimerDesignContext';
import TabPannelSettings from './TabPannelSettings';
import TabPanelResults from './TabPanelResults';

function PrimerDesignSimplePair({ pcrSource, restrictionLigation = false }) {
  const templateSequenceId = pcrSource.input[0];
  const sequenceIds = React.useMemo(() => [templateSequenceId], [templateSequenceId]);
  const initialPrimerDesignSettings = { homologyLength: null, hybridizationLength: 20, targetTm: 55 };

  const steps = React.useMemo(() => [
    { label: 'Amplified region' },
    { label: 'Other settings' },
    { label: 'Results' },
  ], []);

  const designType = restrictionLigation ? 'restriction_ligation' : 'simple_pair';
  return (
    <PrimerDesignProvider designType={designType} sequenceIds={sequenceIds} initialPrimerDesignSettings={initialPrimerDesignSettings}>
      <Box>
        <PrimerDesignStepper steps={steps} />
        {steps.slice(0, sequenceIds.length).map((step, index) => (
          <TabPanelSelectRoi
            key={step.label}
            step={step}
            index={index}
          />
        ))}
        <TabPannelSettings steps={steps} />
        <TabPanelResults />

        {/* {error && (<Alert severity="error" sx={{ width: 'fit-content', margin: 'auto', mb: 2 }}>{error}</Alert>)} */}
      </Box>
    </PrimerDesignProvider>

  );
}

export default PrimerDesignSimplePair;
