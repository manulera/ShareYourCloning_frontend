import { Button } from '@mui/material';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PrimerResultForm from './PrimerResultForm';

function PrimerResultList({ primers, setPrimers, addPrimers }) {
  const existingPrimerNames = useSelector((state) => state.cloning.primers.map((p) => p.name), shallowEqual);
  const primersAreValid = primers.length && primers.every((primer) => primer.name && !existingPrimerNames.includes(primer.name));
  return (
    <div style={{ marginTop: '12px' }}>
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
      {primersAreValid && (
      <Button
        variant="contained"
        color="primary"
        onClick={addPrimers}
        sx={{ mb: 2 }}
      >
        Save primers
      </Button>
      )}
    </div>
  );
}

export default PrimerResultList;
