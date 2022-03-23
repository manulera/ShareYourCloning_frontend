import React from 'react';
import TextField from '@mui/material/TextField';
import { AiFillCheckCircle } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

function Primer({
  addPrimer, deletePrimer, updatePrimer, primer,
}) {
  const [primerName, setPrimerName] = React.useState(primer.name);
  const [sequence, setSequence] = React.useState(primer.sequence);
  const [editingMode, setEditingMode] = React.useState(primer.id === null);
  const onSubmit = (event) => {
    event.preventDefault();
    if (primer.id !== null) {
      updatePrimer({
        id: primer.id,
        name: primerName,
        sequence,
      });
    } else {
      addPrimer({ name: primerName, sequence });
    }
  };
  const showError = sequence.match(/[^agct]/i) !== null;
  const errorText = showError ? 'Not a valid DNA sequence' : '';
  const textShown = (
    <div className="primer-row">
      <TextField sx={{ m: 1, display: { width: '20%' } }} id="name" label="Name" variant="outlined" value={primerName} onChange={(e) => setPrimerName(e.target.value)} />
      <TextField error={showError} helperText={errorText} sx={{ m: 1, display: { width: '60%' } }} id="sequence" label="Sequence" variant="outlined" value={sequence} onChange={(e) => setSequence(e.target.value)} />
      <button type="button" className="icon-hanging">
        <Tooltip title="Save primer" arrow placement="top">
          <Box>
            <AiFillCheckCircle className="node-corner-icon" />
          </Box>
        </Tooltip>
      </button>
    </div>
  );
  console.log(textShown);
  return textShown;
}

export default Primer;
