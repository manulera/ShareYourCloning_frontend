import React from 'react';
import { TextField } from '@mui/material';
import '../PrimerForm.css';
import '../PrimerList.css';
import CustomFormHelperText from '../../form/CustomFormHelperText';

function PrimerResultForm({
  primer: { name, sequence }, updatePrimerName, existingPrimerNames,
}) {
  let nameError = '';
  if (existingPrimerNames.includes(name)) {
    nameError = 'Name exists';
  }
  if (name === '') {
    nameError = 'Name is required';
  }
  return (
    <form className="primer-result-form" onSubmit={(e) => e.preventDefault()}>
      <TextField
        label="Name"
        value={name}
        sx={{ m: 1, pb: 2, display: { width: '20%' } }}
        onChange={(e) => updatePrimerName(e.target.value)}
        error={nameError !== ''}
        helperText={<CustomFormHelperText>{nameError}</CustomFormHelperText>}
      />
      <TextField
        label="Sequence"
        value={sequence}
        inputProps={{ id: 'sequence' }}
        sx={{ m: 1, pb: 2, display: { width: '70%' } }}
        disabled
        helperText={<CustomFormHelperText>Cannot edit, change parameters to design new primers</CustomFormHelperText>}
      />
    </form>
  );
}

export default PrimerResultForm;
