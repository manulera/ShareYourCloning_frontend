import React from 'react';
import Box from '@mui/material/Box';
import PrimerDesignStepper from './PrimerDesignStepper';
import TabPanelSelectRoi from './TabPanelSelectRoi';
import TabPannelSettings from './TabPannelSettings';
import { PrimerDesignProvider } from './PrimerDesignContext';
import TabPanelResults from './TabPanelResults';

export default function PrimerDesignGibsonAssembly({ pcrSources }) {
  const templateSequencesIds = React.useMemo(() => pcrSources.map((pcrSource) => pcrSource.input[0]), [pcrSources]);
  const initialPrimerDesignSettings = { homologyLength: 35, hybridizationLength: 20, targetTm: 55 };
  const steps = React.useMemo(() => [
    ...templateSequencesIds.map((id, index) => (
      { label: `Seq ${id}`, selectOrientation: true }
    )),
    { label: 'Other settings' },
    { label: 'Results' },
  ], [pcrSources]);

  return (
    <PrimerDesignProvider designType="gibson_assembly" sequenceIds={templateSequencesIds} initialPrimerDesignSettings={initialPrimerDesignSettings}>
      <Box>
        <PrimerDesignStepper steps={steps} />
        {steps.slice(0, templateSequencesIds.length).map((step, index) => (
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
