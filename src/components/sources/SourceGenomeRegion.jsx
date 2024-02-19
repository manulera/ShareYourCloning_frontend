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

function getGeneCoordsInfo(gene) {
  const { range: geneRange, accession_version: accessionVersion } = gene.annotation.genomic_regions[0].gene_range;
  const { begin: start, end: stop, orientation } = geneRange[0];
  const strand = orientation === 'plus' ? 1 : -1;
  return { accessionVersion, start, stop, strand };
}

function formatGeneCoords(gene) {
  const { accessionVersion, start, stop, strand } = getGeneCoordsInfo(gene);
  return `${accessionVersion} (${start}..${stop}${strand === -1 ? ', complement' : ''})`;
}

// Extra component to be used in SourceGenomeRegion
function SourceGenomeRegionReference({ assemblyId, speciesPostRequestSettings }) {
  return (
    <>
      <PostRequestSelect {...speciesPostRequestSettings} />
      {assemblyId && (
      <FormControl fullWidth>
        <TextField
          label="Assembly ID"
          value={assemblyId}
          disabled
        />
      </FormControl>
      )}
    </>
  );
}

// Extra component to be used in SourceGenomeRegion
function SourceGenomeRegionOther({ assemblyId, setAssemblyId, assemblyExists, species }) {
  return (
    <>
      <FormControl fullWidth>
        <TextField
          label="Assembly ID"
          value={assemblyId}
          error={assemblyExists === false}
          helperText={assemblyExists === false ? 'Assembly ID does not exist' : ''}
          onChange={(event) => setAssemblyId(event.target.value)}
        />
      </FormControl>

      {(species !== null) && (
      <FormControl fullWidth>
        <TextField
          label="Species"
          value={`${species.organism_name} - ${species.tax_id}`}
          disabled
        />
      </FormControl>
      )}
    </>
  );
}

function SourceGenomeRegion({ sourceId }) {
  const [selectionMode, setSelectionMode] = React.useState('');
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const [gene, setGene] = React.useState(null);
  const [assemblyExists, setAssemblyExists] = React.useState(null);
  const upstreamBasesRef = React.useRef(null);
  const downstreamBasesRef = React.useRef(null);

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
    const { accessionVersion, start, stop, strand } = getGeneCoordsInfo(gene);
    // TODO: Only use if necessary, not all cases should support
    let shiftedStart = Number(start);
    let shiftedStop = Number(stop);
    if (selectionMode !== 'custom_coordinates') {
      shiftedStart -= strand === 1 ? Number(upstreamBasesRef.current.value) : Number(downstreamBasesRef.current.value);
      shiftedStop += strand === 1 ? Number(downstreamBasesRef.current.value) : Number(upstreamBasesRef.current.value);
    }
    const payload = {
      sequence_accession: accessionVersion,
      assembly_accession: assemblyId,
      locus_tag: gene.annotation.locus_tag ? gene.annotation.locus_tag : null,
      start: shiftedStart,
      stop: shiftedStop,
      strand,
    };
    console.log(payload);
    sendPostRequest('genome_coordinates', payload);
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
          <InputLabel id={`selection-mode-${sourceId}-label`}>Type of region</InputLabel>
          <Select
            value={selectionMode}
            onChange={changeSelectionMode}
            labelId={`selection-mode-${sourceId}-label`}
            label="Type of region"
          >
            <MenuItem value="reference_genome">Locus in reference genome</MenuItem>
            <MenuItem value="other_assembly">Locus in other assembly</MenuItem>
            <MenuItem value="custom_coordinates">Custom coordinates</MenuItem>
          </Select>
        </FormControl>
        {selectionMode === 'reference_genome' && (<SourceGenomeRegionReference {...{ assemblyId, speciesPostRequestSettings }} />)}
        {selectionMode === 'other_assembly' && (<SourceGenomeRegionOther {...{ assemblyId, setAssemblyId, assemblyExists, species }} />)}
        {(assemblyId && assemblyExists !== false) && (<PostRequestSelect {...genePostRequestSettings} />)}
        {gene && (
          <>
            <FormControl fullWidth>
              <TextField
                label="Gene coordinates"
                value={formatGeneCoords(gene)}
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Upstream bases"
                inputRef={upstreamBasesRef}
                type="number"
                defaultValue={1000}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Downstream bases"
                inputRef={downstreamBasesRef}
                type="number"
                defaultValue={1000}
              />
            </FormControl>
            <Button fullWidth type="submit" variant="contained">Submit</Button>
          </>
        )}

      </form>

      <div className="waiting-message">{waitingMessage}</div>
    </>
  );
}

export default SourceGenomeRegion;
