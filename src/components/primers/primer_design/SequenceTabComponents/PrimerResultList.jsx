import { Box, Button } from '@mui/material';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PrimerResultForm from './PrimerResultForm';
import StepNavigation from './StepNavigation';

function PrimerResultList({ primers, setPrimers, addPrimers, handleBack }) {
  const existingPrimerNames = useSelector((state) => state.cloning.primers.map((p) => p.name), shallowEqual);
  const primersAreValid = primers.length && primers.every((primer) => primer.name && !existingPrimerNames.includes(primer.name));
  return (
    <Box sx={{ marginTop: 3 }}>
      {primers.map((primer, index) => (
        <PrimerResultForm
          key={index}
          updatePrimerName={(newName) => {
            const updatedPrimers = [...primers];
            updatedPrimers[index] = { ...primer, name: newName };
            setPrimers(updatedPrimers);
          }}
          primer={primer}
          existingPrimerNames={existingPrimerNames}
        />
      ))}
      <StepNavigation
        handleBack={handleBack}
        handleNext={null}
        onStepCompletion={addPrimers}
        stepCompletionText="Save primers"
        nextDisabled
        stepCompletionToolTip="Primers are not valid"
        allowStepCompletion={primersAreValid}
      />
    </Box>
  );
}

export default PrimerResultList;
