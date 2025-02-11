import { Step, StepButton, Stepper } from '@mui/material';
import React from 'react';
import { usePrimerDesign } from './PrimerDesignContext';

function PrimerDesignStepper({ steps }) {
  const { selectedTab, onTabChange, rois, primers } = usePrimerDesign();

  const completedSteps = [
    ...rois.map((roi) => roi !== null),
    primers.length > 0,
    false,
  ];
  const disabledSteps = [
    ...rois.map(() => false),
    rois.some((roi) => roi === null),
    primers.length === 0,
  ];
  console.log(disabledSteps);
  return (
    <Stepper
      nonLinear
      activeStep={selectedTab}
      sx={{
        pt: 1,
        pb: 1,
        '& .Mui-active.MuiStepLabel-label': {
          fontWeight: 'bold',
          color: 'primary.main',
        },

      }}
    >
      {steps.map(({ label, disabled }, index) => (

        <Step key={label} completed={completedSteps[index]}>
          <StepButton disabled={disabledSteps[index]} onClick={() => onTabChange(null, index)}>
            {label}
          </StepButton>
        </Step>
      ))}

    </Stepper>
  );
}

export default PrimerDesignStepper;
