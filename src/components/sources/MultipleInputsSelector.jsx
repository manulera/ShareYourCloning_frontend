import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

function MultipleInputsSelector({ inputEntityIds, onChange }) {
  const entityNotChildSourceIds = useSelector(({ cloning }) => getIdsOfEntitiesWithoutChildSource(cloning.sources, cloning.entities), shallowEqual);

  // The possible options should include the already selected ones + the one without children
  const options = inputEntityIds.concat(entityNotChildSourceIds);

  const onInputChange = (event) => {
    const selectedIds = event.target.value;
    if (selectedIds.includes('all')) {
      onChange(options);
    } else {
      onChange(selectedIds);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-chip-label">Input sequences</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={inputEntityIds}
        onChange={onInputChange}
        label="Input sequences"
        // input={<OutlinedInput id="select-multiple-chip" label="Select input sequences" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        <MenuItem
          key="all"
          value="all"
        >
          <em>Select all</em>
        </MenuItem>
        {options.map((id) => (
          <MenuItem
            key={id}
            value={id}
          >
            {id}
          </MenuItem>
        ))}

      </Select>
    </FormControl>
  );
}

export default MultipleInputsSelector;
