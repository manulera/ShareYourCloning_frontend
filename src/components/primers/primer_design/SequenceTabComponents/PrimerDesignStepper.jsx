import { Step, StepButton, Stepper } from '@mui/material';
import React from 'react';

function PrimerDesignStepper({ selectedTab, steps, onTabChange }) {
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
      {steps.map(({ label, completed, disabled }, index) => (
        <Step key={label} completed={completed === true}>
          <StepButton disabled={disabled === true} onClick={() => onTabChange(null, index)}>
            {label}
          </StepButton>
        </Step>
      ))}

    </Stepper>
  );
}

export default PrimerDesignStepper;
