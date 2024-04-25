import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { cloningActions } from '../../store/cloning';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

function MultipleInputsSelector({ inputEntityIds, sourceId, sourceType }) {
  const dispatch = useDispatch();
  const { updateSource } = cloningActions;

  const onChange = (event) => {
    const input = event.target.value;
    // We prevent setting empty input
    // TODO: test this
    if (input.length === 0) {
      return;
    }
    dispatch(updateSource({ id: sourceId, input, type: sourceType }));
  };
  const entityNotChildSourceIds = useSelector(({ cloning }) => getIdsOfEntitiesWithoutChildSource(cloning.sources, cloning.entities), shallowEqual);

  // The possible options should include the already selected ones + the one without children
  const options = inputEntityIds.concat(entityNotChildSourceIds);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-chip-label">Input sequences</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={inputEntityIds}
        onChange={onChange}
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
