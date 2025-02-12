import React from 'react';
import { Box } from '@mui/material';

import PrimerDesignStepper from './PrimerDesignStepper';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import { PrimerDesignProvider } from './PrimerDesignContext';
import TabPannelSettings from './TabPannelSettings';
import TabPanelResults from './TabPanelResults';

function PrimerDesignGatewayBP({ donorVectorId, pcrSource }) {
  const templateSequenceId = pcrSource.input[0];
  const sequenceIds = React.useMemo(() => [templateSequenceId, donorVectorId], [templateSequenceId, donorVectorId]);
  const initialPrimerDesignSettings = { homologyLength: null, hybridizationLength: 20, targetTm: 55 };
  const steps = React.useMemo(() => [
    { label: 'Amplified region',
      description: `Select the fragment of sequence ${templateSequenceId} to be amplified in the editor and click "Choose region"`,
      inputLabel: `Amplified region (sequence ${templateSequenceId})` },
    { label: 'Replaced region',
      description: 'Select attP sites between which the PCR product will be inserted',
      inputLabel: `Replaced region (sequence ${donorVectorId})`,
      stepCompletionToolTip: 'Select a valid combination of attP sites',
    },
    { label: 'Other settings' },
    { label: 'Results' },
  ], [templateSequenceId, donorVectorId]);

  return (
    <PrimerDesignProvider designType="gateway_bp" sequenceIds={sequenceIds} initialPrimerDesignSettings={initialPrimerDesignSettings}>
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

export default PrimerDesignGatewayBP;
