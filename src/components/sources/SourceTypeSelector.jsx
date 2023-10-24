import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

function SourceTypeSelector({ sourceId, sourceType, setSourceType }) {
  function onChange(event) {
    setSourceType(event.target.value);
  }
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const hasInputEntities = inputEntities.length > 0;
  const options = !hasInputEntities ? (
    [
      <MenuItem value="file">Submit file</MenuItem>,
      <MenuItem value="repository_id">Repository ID</MenuItem>,
    ]
  ) : (
    [
      <MenuItem value="restriction">Restriction</MenuItem>,
      <MenuItem value="sticky_ligation">Ligation with sticky ends</MenuItem>,
      <MenuItem value="PCR">PCR</MenuItem>,
      <MenuItem value="homologous_recombination">Homologous recombination</MenuItem>,
    ]
  );

  return (
    <>
      <h2>Define a sequence source</h2>
      <FormControl fullWidth>
        <InputLabel id={`select-source-${sourceId}-label`}>Source type</InputLabel>
        <Select
          value={sourceType !== null ? sourceType : ''}
          onChange={onChange}
          labelId={`select-source-${sourceId}-label`}
          // Note how you have to set the label in two places
          // see https://stackoverflow.com/questions/67064682/material-ui-outlined-select-label-is-not-rendering-properly
          label="Source type"
        >
          <MenuItem value=" " />
          {options}
        </Select>
      </FormControl>
    </>

  );
}

export default SourceTypeSelector;
