import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Alert, Button } from '@mui/material';
import useBackendAPI from '../../hooks/useBackendAPI';
import PostRequestSelect from '../form/PostRequestSelect';
import { getReferenceAssemblyId, taxonSuggest, geneSuggest, getSpeciesFromAssemblyId } from '../../utils/ncbiRequests';

function getGeneCoordsInfo(gene) {
  const { range: geneRange, accession_version: accessionVersion } = gene.annotation.genomic_regions[0].gene_range;
  const { begin: start, end: stop, orientation } = geneRange[0];
  const strand = orientation === 'plus' ? 1 : -1;
  return { accessionVersion, start: Number(start), stop: Number(stop), strand };
}

function formatGeneCoords(gene) {
  const { accessionVersion, start, stop, strand } = getGeneCoordsInfo(gene);
  return `${accessionVersion} (${start}..${stop}${strand === -1 ? ', complement' : ''})`;
}

function formatBackendPayloadWithGene(assemblyId, gene, shiftUpstream, shiftDownstream) {
  const { accessionVersion, start, stop, strand } = getGeneCoordsInfo(gene);

  const shiftedStart = start - (strand === 1 ? shiftUpstream : shiftDownstream);
  const shiftedStop = stop + (strand === 1 ? shiftDownstream : shiftUpstream);

  return {
    sequence_accession: accessionVersion,
    assembly_accession: assemblyId,
    locus_tag: gene.annotation.locus_tag ? gene.annotation.locus_tag : null,
    gene_id: gene.annotation.gene_id ? gene.annotation.gene_id : null,
    start: shiftedStart,
    stop: shiftedStop,
    strand,
  };
}

function AssemblyPicker({ setAssemblyId, setSpecies }) {
  const [helperText, setHelperText] = React.useState('');
  const [userInput, setUserInput] = React.useState('');
  const [assemblyExists, setAssemblyExists] = React.useState(null);

  React.useEffect(() => {
    // Validate assemblyId with a 500ms delay
    if ((userInput !== '')) {
      setHelperText('Validating assembly ID...');
      const timeOutId = setTimeout(async () => {
        const speciesObj = await getSpeciesFromAssemblyId(userInput);
        if (speciesObj === null) {
          setHelperText('Assembly ID does not exist');
          setAssemblyExists(false);
          setSpecies(null);
          setAssemblyId(null);
        } else {
          setSpecies(speciesObj);
          setAssemblyId(userInput);
          setHelperText('');
          setAssemblyExists(true);
        }
      }, 500);
      return () => clearTimeout(timeOutId);
    }
    // Also set to null if assemblyId is empty
    setHelperText('');
    setAssemblyExists(null);
    return () => {};
  }, [userInput]);

  return (
    <FormControl fullWidth>
      <TextField
        label="Assembly ID"
        value={userInput}
        error={assemblyExists === false}
        helperText={helperText}
        onChange={(event) => setUserInput(event.target.value)}
      />
    </FormControl>

  );
}

function SpeciesPicker({ setSpecies, setAssemblyId, setGene }) {
  const speciesPostRequestSettings = React.useMemo(() => ({
    setValue: (v) => {
      getReferenceAssemblyId(v.tax_id).then((response) => {
        // Set the species
        setSpecies(v);
        // Unset gene
        setGene(null);
        // Set the assemblyId
        setAssemblyId(response === null ? '' : response);
      });
    },
    getOptions: taxonSuggest,
    getOptionLabel: (option) => (option ? `${option.sci_name} - ${option.tax_id}` : ''),
    isOptionEqualToValue: (option, value) => option.tax_id === value.tax_id,
    textLabel: 'Species',
  }));
  return (<PostRequestSelect {...speciesPostRequestSettings} />);
}

// Extra component to be used in SourceGenomeRegion
function SourceGenomeRegionLocusOnReference({ sourceId }) {
  const [gene, setGene] = React.useState(null);
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const upstreamBasesRef = React.useRef(null);
  const downstreamBasesRef = React.useRef(null);
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    const payload = formatBackendPayloadWithGene(assemblyId, gene, Number(upstreamBasesRef.current.value), Number(downstreamBasesRef.current.value));
    sendPostRequest('genome_coordinates', payload);
  };

  return (
    <form onSubmit={onSubmit}>
      <SpeciesPicker {...{ setSpecies, setAssemblyId, setGene }} />
      {assemblyId && (
        <>
          <FormControl fullWidth>
            <TextField
              label="Assembly ID"
              value={assemblyId}
              disabled
            />
          </FormControl>
          <SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }} />
          <Button fullWidth type="submit" variant="contained">Submit</Button>
        </>
      )}
      { (species && assemblyId === '') && (
        <Alert sx={{ alignItems: 'center' }} severity="error">
          The selected species does not have a reference assembly.
        </Alert>
      )}
      <div className="waiting-message">{waitingMessage}</div>
    </form>
  );
}

function KnownSpeciesField({ species }) {
  return (
    <FormControl fullWidth>
      <TextField
        label="Species"
        value={`${species.organism_name} - ${species.tax_id}`}
        disabled
      />
    </FormControl>
  );
}

// Extra component to be used in SourceGenomeRegion
function SourceGenomeRegionLocusOnOther({ sourceId }) {
  const [gene, setGene] = React.useState(null);
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const upstreamBasesRef = React.useRef(null);
  const downstreamBasesRef = React.useRef(null);
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    const payload = formatBackendPayloadWithGene(assemblyId, gene, Number(upstreamBasesRef.current.value), Number(downstreamBasesRef.current.value));
    sendPostRequest('genome_coordinates', payload);
  };

  return (
    <form onSubmit={onSubmit}>
      <AssemblyPicker {...{ setAssemblyId, setSpecies }} />
      {assemblyId && (
        <>
          <KnownSpeciesField species={species} />
          <SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }} />
          <Button fullWidth type="submit" variant="contained">Submit</Button>
        </>
      )}
      <div className="waiting-message">{waitingMessage}</div>
    </form>
  );
}

// Extra component to be used in SourceGenomeRegion
function SourceGenomeRegionCustomCoordinates({ sourceId }) {
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const upstreamBasesRef = React.useRef(null);
  const downstreamBasesRef = React.useRef(null);
  const { waitingMessage, sendPostRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    // const payload = formatBackendPayloadWithGene(assemblyId, gene, Number(upstreamBasesRef.current.value), Number(downstreamBasesRef.current.value));
    sendPostRequest('genome_coordinates', payload);
  };

  return (
    <form onSubmit={onSubmit}>
      <AssemblyPicker {...{ setAssemblyId, setSpecies }} />
      {assemblyId && (
        <>
          <KnownSpeciesField species={species} />
          <SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }} />
          <Button fullWidth type="submit" variant="contained">Submit</Button>
        </>
      )}
      <div className="waiting-message">{waitingMessage}</div>
    </form>
  );
}

function SourceGenomeRegionSelectGene({ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }) {
  const genePostRequestSettings = React.useMemo(() => ({
    setValue: setGene,
    getOptions: (userInput) => geneSuggest(assemblyId, userInput),
    getOptionLabel: ({ annotation }) => (annotation ? `${annotation.symbol} ${annotation.locus_tag === undefined ? '' : annotation.locus_tag} ${annotation.name}` : ''),
    isOptionEqualToValue: (option, value) => option.locus_tag === value.locus_tag,
    textLabel: 'Gene',
  }), [setGene]);

  return (
    <>
      <PostRequestSelect {...genePostRequestSettings} />
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
      </>
      )}
    </>
  );
}

function SourceGenomeRegion({ sourceId }) {
  const [selectionMode, setSelectionMode] = React.useState('reference_genome');
  const changeSelectionMode = (event) => { setSelectionMode(event.target.value); };

  return (
    <>
      <form>
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
      </form>
      {selectionMode === 'reference_genome' && (<SourceGenomeRegionLocusOnReference sourceId={sourceId} />)}
      {selectionMode === 'other_assembly' && (<SourceGenomeRegionLocusOnOther sourceId={sourceId} />)}
      {/* {selectionMode !== 'custom_coordinates' && (<SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, assemblyId, assemblyExists }} />)} */}

      {/* {selectionMode === 'custom_coordinates' && (<SourceGenomeRegionCustomCoordinates {...{ assemblyId, setAssemblyId, assemblyExists, species }} />)} */}

    </>
  );
}

export default SourceGenomeRegion;
