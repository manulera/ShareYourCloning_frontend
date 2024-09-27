import { Box, FormControl, FormLabel, InputAdornment, TextField } from '@mui/material';
import React from 'react';

function PrimerSettingsForm({
  homologyLength, setHomologyLength,
  targetTm, setTargetTm,
  hybridizationLength, setHybridizationLength,
}) {
  return (
    <Box sx={{ pt: 1 }}>
      <FormLabel>Primer settings</FormLabel>
      <Box sx={{ pt: 1.5 }}>
        {setHomologyLength !== null && (
        <Box>
          <FormControl>
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
        </Box>
        )}
        <Box sx={{ pt: 2 }}>
          <FormControl sx={{ mr: 2 }}>
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

          <FormControl>
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
        </Box>
      </Box>
    </Box>
  );
}

export default PrimerSettingsForm;
