import React from 'react';
import Box from '@mui/material/Box';
import PrimerDesignStepper from './PrimerDesignStepper';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import { PrimerDesignProvider } from './PrimerDesignContext';
import TabPanelResults from './TabPanelResults';
import TabPannelSettings from './TabPannelSettings';

export default function PrimerDesignHomologousRecombination({ homologousRecombinationTargetId, pcrSource }) {
  const templateSequenceId = pcrSource.input[0];
  const sequenceIds = React.useMemo(() => [templateSequenceId, homologousRecombinationTargetId], [templateSequenceId, homologousRecombinationTargetId]);
  const initialPrimerDesignSettings = { homologyLength: 80, hybridizationLength: 20, targetTm: 55 };

  const steps = React.useMemo(() => [
    { label: 'Amplified region',
      description: `Select the fragment of sequence ${templateSequenceId} to be amplified in the editor and click "Choose region"`,
      inputLabel: `Amplified region (sequence ${templateSequenceId})` },
    { label: 'Replaced region',
      description: 'Select the single position (insertion) or region (replacement) where recombination will introduce the amplified fragment',
      inputLabel: `Replaced region (sequence ${homologousRecombinationTargetId})`,
      allowSinglePosition: true,
    },
    { label: 'Other settings' },
    { label: 'Results' },
  ], [templateSequenceId, homologousRecombinationTargetId]);

  return (
    <PrimerDesignProvider designType="homologous_recombination" sequenceIds={sequenceIds} initialPrimerDesignSettings={initialPrimerDesignSettings}>
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
