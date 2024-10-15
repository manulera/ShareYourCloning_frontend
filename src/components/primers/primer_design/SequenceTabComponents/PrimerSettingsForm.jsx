import { Box, FormControl, FormLabel, InputAdornment, TextField } from '@mui/material';
import React from 'react';

import primerDesignMinimalValues from './primerDesignMinimalValues.json';

function PrimerSettingsForm({
  homologyLength, setHomologyLength,
  targetTm, setTargetTm,
  hybridizationLength, setHybridizationLength,
}) {
  return (
    <Box sx={{ pt: 1 }}>
      <FormLabel>Primer settings</FormLabel>
      <Box sx={{ pt: 1.5 }}>
        {homologyLength !== null && (
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
              error={homologyLength < primerDesignMinimalValues.homology_length}
              helperText={homologyLength < primerDesignMinimalValues.homology_length ? `Min. ${primerDesignMinimalValues.homology_length} bp` : ''}
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
              error={targetTm < primerDesignMinimalValues.target_tm}
              helperText={targetTm < primerDesignMinimalValues.target_tm ? `Min. ${primerDesignMinimalValues.target_tm} °C` : ''}
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
              error={hybridizationLength < primerDesignMinimalValues.hybridization_length}
              helperText={hybridizationLength < primerDesignMinimalValues.hybridization_length ? `Min. ${primerDesignMinimalValues.hybridization_length} bp` : ''}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

export default PrimerSettingsForm;
