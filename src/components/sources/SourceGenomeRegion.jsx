import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import useBackendAPI from '../../hooks/useBackendAPI';
import PostRequestSelect from '../form/PostRequestSelect';
import { getReferenceAssemblyId, taxonSuggest, geneSuggest } from '../../utils/ncbiRequests';

function SourceGenomeRegion({ sourceId }) {
  const [selectionMode, setSelectionMode] = React.useState('');
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const [geneId, setGeneId] = React.useState('');
  const [geneCoords, setGeneCoords] = React.useState('');

  const speciesPostRequestSettings = React.useMemo(() => ({
    setValue: setSpecies,
    getOptions: taxonSuggest,
    getOptionLabel: (option) => (option ? `${option.sci_name} - ${option.tax_id}` : ''),
    isOptionEqualToValue: (option, value) => option.tax_id === value.tax_id,
    textLabel: 'Species',
  }));

  const genePostRequestSettings = React.useMemo(() => ({
    setValue: setGeneId,
    getOptions: (userInput) => geneSuggest(assemblyId, userInput),
    getOptionLabel: ({ annotation }) => (annotation ? `${annotation.symbol} ${annotation.locus_tag} ${annotation.name}` : ''),
    isOptionEqualToValue: (option, value) => option.locus_tag === value.locus_tag,
    textLabel: 'Gene',
  }), [assemblyId]);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log('hello');
    // sendPostRequest('repository_id', { repository_id: repositoryIdRef.current.value, repository: selectedRepository });
  };

  React.useEffect(() => {
    if (selectionMode === 'reference_genome') {
      getReferenceAssemblyId(species.tax_id).then((response) => {
        setAssemblyId(response);
      });
    }
  }, [species]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <InputLabel id={`selection-mode-${sourceId}-label`}>Type of genome</InputLabel>
          <Select
            value={selectionMode}
            onChange={(event) => setSelectionMode(event.target.value)}
            labelId={`selection-mode-${sourceId}-label`}
            label="Type of genome"
          >
            <MenuItem value="reference_genome">Reference genome</MenuItem>
            <MenuItem value="other_assembly">Other assembly</MenuItem>
          </Select>
        </FormControl>
        {selectionMode === 'reference_genome' && (<PostRequestSelect {...speciesPostRequestSettings} />)}
        {(assemblyId && selectionMode === 'reference_genome') && (
        <TextField
          fullWidth
          label="Assembly ID"
          value={assemblyId}
          disabled
        />
        )}
        {selectionMode === 'other_assembly' && (
        <TextField
          fullWidth
          label="Assembly ID"
          value={assemblyId}
          onChange={(event) => setAssemblyId(event.target.value)}
        />
        )}
        {assemblyId && (<PostRequestSelect {...genePostRequestSettings} />)}
        <Button fullWidth type="submit" variant="contained">Submit</Button>
      </form>

      <div className="waiting-message">{waitingMessage}</div>
    </>
  );
}

export default SourceGenomeRegion;
