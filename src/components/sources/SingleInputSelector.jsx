import React from 'react';
import { useSelector } from 'react-redux';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

const customSelector = createSelector(
  [({ cloning }) => ({ sources: cloning.sources, entities: cloning.entities })],
  ({ sources, entities }) => getIdsOfEntitiesWithoutChildSource(sources, entities),
);

function SingleInputSelector({ selectedId, onChange, label, inputEntityIds }) {
  const idsWithoutChild = useSelector(customSelector);
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
        {options.map((id) => <MenuItem key={id} value={id}>{id}</MenuItem>)}
      </Select>
    </>
  );
}

export default SingleInputSelector;
