import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

function SingleInputSelector({ selectedId, onChange, label, inputEntityIds }) {
  const idsWithoutChild = useSelector(({ cloning }) => getIdsOfEntitiesWithoutChildSource(cloning.sources, cloning.entities), shallowEqual);
  const options = [...idsWithoutChild, ...inputEntityIds];
  return (
    <>
      <InputLabel id="select-single-inputs">{label}</InputLabel>
      <Select
        value={selectedId !== null ? selectedId : ''}
        onChange={onChange}
        labelId="select-single-inputs"
        label={label}
      >
        {options.sort().map((id) => <MenuItem key={id} value={id}>{id}</MenuItem>)}
      </Select>
    </>
  );
}

export default SingleInputSelector;
