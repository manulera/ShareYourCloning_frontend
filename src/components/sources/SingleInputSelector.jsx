import React from 'react';
import { useSelector } from 'react-redux';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

function SingleInputSelector({ selectedId, onChange, label, inputEntityIds }) {
  const options = useSelector(({ cloning }) => getIdsOfEntitiesWithoutChildSource(cloning.sources, cloning.entities));
  options.push(...inputEntityIds);
  return (
    <>
      <InputLabel id="select-single-inputs">{label}</InputLabel>
      <Select
        value={selectedId}
        onChange={onChange}
        labelId="select-single-inputs"
        label={label}
      >
        {options.map((id) => <MenuItem key={id} value={id}>{id}</MenuItem>)}
      </Select>
    </>
  );
}

export default SingleInputSelector;
