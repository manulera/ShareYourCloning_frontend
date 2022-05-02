import React from 'react';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { stringIsNotDNA } from './validators';

function PrimerEditInline({
  primer, updatePrimer, setEditMode,
}) {
  const [localPrimer, setLocalPrimer] = React.useState(primer);
  const formHelperFormatted = (str) => (
    <FormHelperText style={{ fontSize: 'x-small' }}>{str}</FormHelperText>
  );
  const sequenceIsNotDNA = stringIsNotDNA(localPrimer.sequence);
  const errorTextSequence = sequenceIsNotDNA ? formHelperFormatted('Not a valid DNA sequence') : '';
  const updateName = (name) => setLocalPrimer({ ...localPrimer, name });
  const updateSequence = (sequence) => setLocalPrimer({ ...localPrimer, sequence });

  const commitChanges = () => {
    if (!sequenceIsNotDNA) {
      setEditMode(false);
      updatePrimer(localPrimer);
    }
  };
  return (
    <div className="primer-row">
      <TextField inputProps={{ style: { fontSize: 14 } }} sx={{ m: 1, display: { width: '20%' } }} id="name" label="Name" variant="outlined" value={localPrimer.name} onChange={(e) => updateName(e.target.value)} />
      <TextField error={sequenceIsNotDNA} inputProps={{ style: { fontSize: 14 } }} helperText={errorTextSequence} sx={{ m: 1, display: { width: '60%' } }} id="sequence" label="Sequence" variant="outlined" value={localPrimer.sequence} onChange={(e) => updateSequence(e.target.value)} />
      <button type="button" className="icon-hanging" onClick={commitChanges}>
        <Tooltip title={sequenceIsNotDNA ? 'Not a valid sequence' : 'Save changes'} arrow placement="top">
          <Box sx={{ m: 1 }}>
            <FaCheckCircle size={25} color={sequenceIsNotDNA ? 'grey' : 'green'} />
          </Box>
        </Tooltip>
      </button>
      <button type="button" className="icon-hanging" onClick={() => setEditMode(false)}>
        <Tooltip title="Discard changes" arrow placement="top">
          <Box sx={{ m: 1 }}>
            <FaTimesCircle size={25} color="red" />
          </Box>
        </Tooltip>
      </button>
    </div>
  );
}

export default PrimerEditInline;
