import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Alert, Box, Button, FormLabel } from '@mui/material';
import useBackendAPI from '../../hooks/useBackendAPI';
import PostRequestSelect from '../form/PostRequestSelect';
import { getReferenceAssemblyId, taxonSuggest, geneSuggest, getInfoFromAssemblyId, getInfoFromSequenceAccession } from '../../utils/ncbiRequests';
import TextFieldValidate from '../form/TextFieldValidate';

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
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);

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
          <KnownAssemblyField assemblyId={assemblyId} />
          <SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }} />
          <Button fullWidth type="submit" variant="contained">Submit</Button>
        </>
      )}
      { (species && assemblyId === '') && (
        <Alert sx={{ alignItems: 'center' }} severity="error">
          The selected species does not have a reference assembly.
        </Alert>
      )}
      <div className="waiting-message">{requestStatus}</div>
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

function KnownAssemblyField({ assemblyId }) {
  return (
    <FormControl fullWidth>
      <TextField
        label="Assembly ID"
        value={assemblyId}
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
  const [noAnnotationError, setNoAnnotationError] = React.useState(false);
  const upstreamBasesRef = React.useRef(null);
  const downstreamBasesRef = React.useRef(null);
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    const payload = formatBackendPayloadWithGene(assemblyId, gene, Number(upstreamBasesRef.current.value), Number(downstreamBasesRef.current.value));
    sendPostRequest('genome_coordinates', payload);
  };

  const onAssemblyIdChange = (userInput, resp) => {
    setGene(null);
    setSpecies(resp === null ? null : resp.species);
    setAssemblyId(resp === null ? null : userInput);
    setNoAnnotationError(resp !== null && resp.annotationInfo === null);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextFieldValidate onChange={onAssemblyIdChange} getterFunction={getInfoFromAssemblyId} label="Assembly ID" />
      {assemblyId && !noAnnotationError && (
        <>
          <KnownSpeciesField species={species} />
          <SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }} />
          <Button fullWidth type="submit" variant="contained">Submit</Button>
        </>
      )}
      {noAnnotationError && (<Alert severity="error">The selected assembly has no gene annotations</Alert>)}
      <div className="waiting-message">{requestStatus}</div>
    </form>
  );
}

// Extra component to be used in SourceGenomeRegion
function SourceGenomeRegionCustomCoordinates({ sourceId }) {
  // https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=nuccore&db=assembly&id=CM041205.1&idtype=acc
  const [species, setSpecies] = React.useState(null);
  const [assemblyId, setAssemblyId] = React.useState('');
  const [sequenceAccession, setSequenceAccession] = React.useState('');
  const coordsStartRef = React.useRef(null);
  const coordsEndRef = React.useRef(null);
  // I don't manage to use refs for the Select component
  const [coordsStrand, setCoordsStrand] = React.useState('');
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);
  const onSubmit = (event) => {
    event.preventDefault();

    sendPostRequest('genome_coordinates', {
      sequence_accession: sequenceAccession,
      assembly_accession: assemblyId,
      start: coordsStartRef.current.value,
      stop: coordsEndRef.current.value,
      strand: coordsStrand === 'plus' ? 1 : -1,
    });
  };

  const onAccessionChange = async (userInput, resp) => {
    if (resp === null) {
      setSpecies(null);
      setAssemblyId('');
      setSequenceAccession('');
      return;
    }
    if (resp.assemblyAccession !== null) {
      const { species: assemblySpecies } = await getInfoFromAssemblyId(resp.assemblyAccession);
      setAssemblyId(resp.assemblyAccession);
      setSpecies(assemblySpecies);
    } else {
      // The sequence accession is not linked to an assembly
      setAssemblyId('');
      setSpecies(null);
    }
    setSequenceAccession(resp.sequenceAccessionStandard);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextFieldValidate onChange={onAccessionChange} getterFunction={getInfoFromSequenceAccession} label="Sequence accession" />
      {species && (<KnownSpeciesField species={species} />)}
      {assemblyId && (<KnownAssemblyField assemblyId={assemblyId} />)}
      {sequenceAccession && !assemblyId && (<Alert severity="warning">The sequence accession is not linked to an assembly</Alert>)}
      {sequenceAccession && (
        <>
          <Box component="fieldset" sx={{ p: 1, mb: 1 }} style={{ borderRadius: '.5em', boxShadow: null }}>
            <legend><FormLabel>Sequence coordinates</FormLabel></legend>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Start"
                inputRef={coordsStartRef}
                type="number"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="End"
                inputRef={coordsEndRef}
                type="number"
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id={`selection-mode-${sourceId}-strand-label`}>Strand</InputLabel>
              <Select
                labelId={`selection-mode-${sourceId}-strand-label`}
                label="Strand"
                value={coordsStrand}
                onChange={(event) => setCoordsStrand(event.target.value)}
              >
                <MenuItem value="plus">plus</MenuItem>
                <MenuItem value="minus">minus</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button fullWidth type="submit" variant="contained">Submit</Button>
        </>
      )}
      <div className="waiting-message">{requestStatus}</div>
    </form>
  );
}

function SourceGenomeRegionSelectGene({ gene, upstreamBasesRef, downstreamBasesRef, setGene, assemblyId }) {
  const [error, setError] = React.useState('');
  const genePostRequestSettings = React.useMemo(() => ({
    setValue: setGene,
    getOptions: async (userInput) => {
      try {
        // We await the response to catch the error
        return await geneSuggest(assemblyId, userInput);
      } catch (e) {
        // Here we are assuming that the assemblyId has been validated
        setError('The assembly has no gene annotations');
        return [];
      }
    },
    getOptionLabel: ({ annotation }) => (annotation ? `${annotation.symbol} ${annotation.locus_tag === undefined ? '' : annotation.locus_tag} ${annotation.name}` : ''),
    isOptionEqualToValue: (option, value) => option.locus_tag === value.locus_tag,
    textLabel: 'Gene',
  }), [setGene]);

  return (
    <>
      <PostRequestSelect {...genePostRequestSettings} />
      {error && (<Alert severity="error">{error}</Alert>)}
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
  const [selectionMode, setSelectionMode] = React.useState('');
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
      {selectionMode === 'custom_coordinates' && (<SourceGenomeRegionCustomCoordinates sourceId={sourceId} />)}
      {/* {selectionMode !== 'custom_coordinates' && (<SourceGenomeRegionSelectGene {...{ gene, upstreamBasesRef, downstreamBasesRef, assemblyId, assemblyExists }} />)} */}

      {/* {selectionMode === 'custom_coordinates' && (<SourceGenomeRegionCustomCoordinates {...{ assemblyId, setAssemblyId, assemblyExists, species }} />)} */}

    </>
  );
}

export default SourceGenomeRegion;
