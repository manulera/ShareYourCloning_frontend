import React from 'react';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import { FaTrashAlt } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { stringIsNotDNA } from './validators';

function PrimerEdit({
  primer, index, updatePrimer, deletePrimer, nameIsRepeated,
}) {
  const formHelperFormatted = (str) => (
    <FormHelperText style={{ fontSize: 'x-small' }}>{str}</FormHelperText>
  );
  const sequenceIsNotDNA = stringIsNotDNA(primer.sequence);
  const errorTextSequence = sequenceIsNotDNA ? formHelperFormatted('Not a valid DNA sequence') : '';
  const errorTextName = nameIsRepeated ? formHelperFormatted('Not unique') : '';
  const updateName = (name) => updatePrimer({ ...primer, name }, index);
  const updateSequence = (sequence) => updatePrimer({ ...primer, sequence }, index);

  return (
    <div className="primer-row">
      <TextField error={nameIsRepeated} inputProps={{ style: { fontSize: 14 } }} helperText={errorTextName} sx={{ m: 1, display: { width: '20%' } }} id="name" label="Name" variant="outlined" value={primer.name} onChange={(e) => updateName(e.target.value)} />
      <TextField error={sequenceIsNotDNA} inputProps={{ style: { fontSize: 14 } }} helperText={errorTextSequence} sx={{ m: 1, display: { width: '60%' } }} id="sequence" label="Sequence" variant="outlined" value={primer.sequence} onChange={(e) => updateSequence(e.target.value)} />
      <button type="button" className="icon-hanging" onClick={() => deletePrimer(index)}>
        <Tooltip title="Delete primer" arrow placement="top">
          <Box sx={{ m: 1 }}>
            <FaTrashAlt size={18} color="red" />
          </Box>
        </Tooltip>
      </button>
    </div>
  );
}

export default PrimerEdit;
