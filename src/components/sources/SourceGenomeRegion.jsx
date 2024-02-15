import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import useBackendAPI from '../../hooks/useBackendAPI';
import PostRequestSelect from '../form/PostRequestSelect';
import { getReferenceAssemblyId, taxonSuggest, geneSuggest, getSpeciesFromAssemblyId } from '../../utils/ncbiRequests';

function formatGeneCoords(gene) {
  console.log(gene.annotation);
  const { range: geneRange, accession_version: accessionVersion } = gene.annotation.genomic_regions[0].gene_range;
  const { begin, end, orientation } = geneRange[0];
  return `${accessionVersion} (${begin}..${end}${orientation !== 'plus' ? ', complement' : ''})`;
}

function SourceGenomeRegion({ sourceId }) {
  const [selectionMode, setSelectionMode] = React.useState('');
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const [gene, setGene] = React.useState(null);
  const [geneCoords, setGeneCoords] = React.useState('');
  const [assemblyExists, setAssemblyExists] = React.useState(null);

  const changeSelectionMode = (event) => { setGene(null); setAssemblyId(''); setSpecies(null); setSelectionMode(event.target.value); };

  const speciesPostRequestSettings = React.useMemo(() => ({
    setValue: (v) => { setGene(null); setAssemblyId(''); setSpecies(v); },
    getOptions: taxonSuggest,
    getOptionLabel: (option) => (option ? `${option.sci_name} - ${option.tax_id}` : ''),
    isOptionEqualToValue: (option, value) => option.tax_id === value.tax_id,
    textLabel: 'Species',
  }));

  const genePostRequestSettings = React.useMemo(() => ({
    setValue: setGene,
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

  React.useEffect(() => {
    async function validateAssembly() {
      const speciesObj = await getSpeciesFromAssemblyId(assemblyId);
      console.log(speciesObj);
      setAssemblyExists(speciesObj !== null);
      setSpecies(speciesObj);
    }
    if (selectionMode === 'other_assembly') {
      const timeOutId = setTimeout(() => validateAssembly(), 500);
      return () => clearTimeout(timeOutId);
    }
    setAssemblyExists(null);
    return () => {};
  }, [assemblyId]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <InputLabel id={`selection-mode-${sourceId}-label`}>Type of genome</InputLabel>
          <Select
            value={selectionMode}
            onChange={changeSelectionMode}
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
          error={assemblyExists === false}
          helperText={assemblyExists === false ? 'Assembly ID does not exist' : ''}
          onChange={(event) => setAssemblyId(event.target.value)}
        />
        )}
        {(selectionMode === 'other_assembly' && species !== null) && (
        <TextField
          fullWidth
          label="Species"
          value={`${species.organism_name} - ${species.tax_id}`}
          disabled
        />
        )}
        {(assemblyId && assemblyExists !== false) && (<PostRequestSelect {...genePostRequestSettings} />)}
        {gene && (
          <TextField
            fullWidth
            label="Gene coordinates"
            value={formatGeneCoords(gene)}
            disabled
          />
        )}
        <Button fullWidth type="submit" variant="contained">Submit</Button>
      </form>

      <div className="waiting-message">{waitingMessage}</div>
    </>
  );
}

export default SourceGenomeRegion;
