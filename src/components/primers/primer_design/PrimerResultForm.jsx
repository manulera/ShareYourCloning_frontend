import React from 'react';
import { FormControl, TextField } from '@mui/material';
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
      <FormControl sx={{ m: 1, pb: 2, display: { width: '20%' } }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => updatePrimerName(e.target.value)}
          error={nameError !== ''}
          FormHelperTextProps={{ component: 'div' }}
          helperText={<CustomFormHelperText>{nameError}</CustomFormHelperText>}
        />
      </FormControl>
      <FormControl sx={{ m: 1, pb: 2, display: { width: '70%' } }}>
        <TextField
          label="Sequence"
          value={sequence}
          inputProps={{ id: 'sequence' }}
          FormHelperTextProps={{ component: 'div' }}
          disabled
          helperText={<CustomFormHelperText>Cannot edit, change parameters to design new primers</CustomFormHelperText>}
        />
      </FormControl>
    </form>
  );
}

export default PrimerResultForm;
