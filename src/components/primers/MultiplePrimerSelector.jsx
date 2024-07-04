import React from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';

function MultiplePrimerSelector({ onChange, label }) {
  const [picked, setPicked] = React.useState([]);
  const primers = useSelector((state) => state.cloning.primers);

  const handleChange = (event) => {
    const input = event.target.value;
    setPicked(input);
    onChange(input.map((id) => primers.find((p) => p.id === id)));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="primer-multiple-chip-label">{label}</InputLabel>
      <Select
        labelId="primer-multiple-chip-label"
        id="primer-multiple-chip"
        multiple
        value={picked}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((id) => (
              <Chip key={id} label={primers.find((p) => p.id === id).name} />
            ))}
          </Box>
        )}
      >
        {primers.map((p) => (
          <MenuItem
            key={p.id}
            value={p.id}
          >
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiplePrimerSelector;
