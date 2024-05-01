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
  const options = [];
  if (inputEntities.length === 0) {
    options.push(<MenuItem key="file" value="file">Submit file</MenuItem>);
    options.push(<MenuItem key="RepositoryIdSource" value="RepositoryIdSource">Repository ID</MenuItem>);
    options.push(<MenuItem key="genome_region" value="genome_region">Genome region</MenuItem>);
    options.push(<MenuItem key="manually_typed" value="manually_typed">Enter manually</MenuItem>);
    options.push(<MenuItem key="OligoHybridizationSource" value="OligoHybridizationSource">Oligonucleotide hybridization</MenuItem>);
    // elab-demo
    // options.push(<MenuItem key="elabftw" value="elabftw">Import from eLabFTW</MenuItem>);
  } else {
    // See https://github.com/manulera/ShareYourCloning_frontend/issues/101
    if (inputEntities.length < 2) {
      options.push(<MenuItem key="restriction" value="restriction">Restriction</MenuItem>);
      options.push(<MenuItem key="PCR" value="PCR">PCR</MenuItem>);
      options.push(<MenuItem key="PolymeraseExtensionSource" value="PolymeraseExtensionSource">Polymerase extension</MenuItem>);
    }
    options.push(<MenuItem key="ligation" value="ligation">Ligation (sticky / blunt)</MenuItem>);
    options.push(<MenuItem key="gibson_assembly" value="gibson_assembly">Gibson assembly</MenuItem>);
    options.push(<MenuItem key="homologous_recombination" value="homologous_recombination">Homologous recombination</MenuItem>);
    options.push(<MenuItem key="crispr" value="crispr">CRISPR</MenuItem>);
    options.push(<MenuItem key="restriction_and_ligation" value="restriction_and_ligation">Restriction + ligation / Golden Gate</MenuItem>);
  }

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
          {options}
        </Select>
      </FormControl>
    </>

  );
}

export default SourceTypeSelector;
