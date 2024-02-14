import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import axios from 'axios';
import useBackendAPI from '../../hooks/useBackendAPI';
import SpeciesSelect from '../form/SpeciesSelect';
import { getReferenceAssemblyId } from '../../utils/ncbiRequests';

// async function getAssemblyId(taxonId) {
//   const url = `https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/taxon/${taxonId}/dataset_report?filters.reference_only=true`;
//   axios.get(url).then((response) => {
//     console.log(response);
//   });
// }

function SourceGenomeRegion({ sourceId }) {
  const [selectionMode, setSelectionMode] = React.useState('');
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
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
        {selectionMode === 'reference_genome' && (<SpeciesSelect setSpecies={setSpecies} />)}
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
        <Button fullWidth type="submit" variant="contained">Submit</Button>
      </form>

      <div className="waiting-message">{waitingMessage}</div>
    </>
  );
}

export default SourceGenomeRegion;
