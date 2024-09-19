import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';

function OrientationPicker({ value, onChange, label, index }) {
  return (
    <FormControl sx={{ py: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <FormLabel id={`fragment-orientation-label-${index}`} sx={{ mr: 2 }}>{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={`fragment-orientation-label-${index}`}
        name={`fragment-orientation-${index}`}
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value="forward" control={<Radio />} label="Forward" />
        <FormControlLabel value="reverse" control={<Radio />} label="Reverse" />
      </RadioGroup>
    </FormControl>
  );
}

export default OrientationPicker;
