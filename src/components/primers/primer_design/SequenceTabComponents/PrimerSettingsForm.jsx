import { FormControl, InputAdornment, TextField } from '@mui/material';
import React from 'react';

function PrimerSettingsForm({
  homologyLength, setHomologyLength,
  targetTm, setTargetTm,
  hybridizationLength, setHybridizationLength,
}) {
  return (
    <>
      <div>
        <FormControl sx={{ py: 2 }}>
          <TextField
            label="Homology length"
            value={homologyLength}
            onChange={(e) => { setHomologyLength(Number(e.target.value)); }}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">bp</InputAdornment>,
              sx: { width: '10em' },
            }}
          />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ py: 1, mr: 2 }}>
          <TextField
            label="Target hybridization Tm"
            value={targetTm}
            onChange={(e) => { setTargetTm(Number(e.target.value)); }}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">°C</InputAdornment>,
              sx: { width: '10em' },
            }}
          />
        </FormControl>

        <FormControl sx={{ py: 1 }}>
          <TextField
            sx={{ minWidth: 'max-content' }}
            label="Min. hybridization length"
            value={hybridizationLength}
            onChange={(e) => { setHybridizationLength(Number(e.target.value)); }}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">bp</InputAdornment>,
              sx: { width: '10em' },
            }}
          />
        </FormControl>
      </div>
    </>
  );
}

export default PrimerSettingsForm;
