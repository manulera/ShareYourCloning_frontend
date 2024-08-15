import { convertToTeselaJson } from '../utils/sequenceParsers';

export const isEntityInputOfAnySource = (id, sources) => (sources.find((source) => source.input.includes(id))) !== undefined;

export function getIdsOfEntitiesWithoutChildSource(sources, entities) {
  let idsEntitiesWithChildSource = [];
  sources.forEach((source) => {
    idsEntitiesWithChildSource = idsEntitiesWithChildSource.concat(source.input);
  });
  const entitiesNotChildSource = [];

  entities.forEach((entity) => {
    if (!idsEntitiesWithChildSource.includes(entity.id)) {
      entitiesNotChildSource.push(entity);
    }
  });
  return entitiesNotChildSource.map((entity) => entity.id);
}

export function getInputEntitiesFromSourceId(state, sourceId) {
  const thisSource = state.cloning.sources.find((s) => s.id === sourceId);
  // Entities must be returned in the same order as in the source input
  return thisSource.input.map((id) => state.cloning.entities.find((e) => e.id === id));
}

export function isSourceATemplate({ sources, entities }, sourceId) {
  // Get the output sequence
  const source = sources.find((s) => s.id === sourceId);
  const sequences = [...entities.filter((e) => e.id === source.output), ...entities.filter((e) => source.input.includes(e.id))];
  return sequences.some((s) => s.type === 'TemplateSequence');
}

export function getPrimerDesignObject({ sources, entities }) {
  // Find sequences that are templates and have primer_design set to true
  const mockSequences = entities.filter((e) => e.type === 'TemplateSequence' && e.primer_design === true);
  if (mockSequences.length === 0) {
    // return 'No primer design sequence templates found';
    return { finalSource: null, templateSequencesIds: [], otherInputIds: [] };
  }
  const mockSequenceIds = mockSequences.map((s) => s.id);

  // Find the source they are input to (there should only be one)
  const finalSources = sources.filter((s) => s.input.some((i) => mockSequenceIds.includes(i)));

  if (finalSources.length === 0) {
    // return 'No sources with primer design sequence templates as inputs found';
    return { finalSource: null, templateSequencesIds: [], otherInputIds: [] };
  }
  if (finalSources.length > 1) {
    // return 'More than one source with primer design sequence templates as inputs found';
    return { finalSource: null, templateSequencesIds: [], otherInputIds: [] };
  }

  const finalSource = finalSources[0];

  // Find the PCRs from which the mock sequences are outputs
  const pcrSources = sources.filter((s) => mockSequenceIds.includes(s.output));

  // Find the template sequences form those PCRs
  const templateSequences = entities.filter((e) => pcrSources.some((ps) => ps.input.includes(e.id)));

  // They should not be mock sequences
  if (templateSequences.some((ts) => ts.type === 'TemplateSequence')) {
    // return 'TemplateSequence input to final source is a TemplateSequence';
    return { finalSource: null, templateSequencesIds: [], otherInputIds: [] };
  }

  const templateSequencesIds = templateSequences.map((s) => s.id);
  // Inputs to the finalSource that are not mock sequences with primer_design
  const otherInputIds = finalSource.input.filter((i) => !mockSequenceIds.includes(i));
  const otherInputs = entities.filter((e) => otherInputIds.includes(e.id));
  // There should be no TemplateSequence as an input that does not have primer_design set to true
  if (otherInputs.some((i) => i.type === 'TemplateSequence' && i.primer_design !== true)) {
    // return 'TemplateSequence input to final source does not have primer_design set to true';
    return { finalSource: null, templateSequencesIds: [], otherInputIds: [] };
  }

  return { finalSource, templateSequencesIds, otherInputIds, pcrSources };
}

const formatPrimer = (primer, position) => {
  const { name, sequence, id } = primer;
  return {
    id: `${id}`,
    name,
    ...position,
    type: 'primer_bind',
    primerBindsOn: '3prime',
    forward: position.strand === 1,
    bases: sequence,
  };
};

export function getPrimerLinks({ primers, primer2entityLinks }, entityId) {
  const relatedLinks = primer2entityLinks.filter((link) => link.entityId === entityId);
  const out = relatedLinks.map(({ position, primerId }) => {
    const primer = primers.find((p) => p.id === primerId);
    if (primer === undefined) {
      return null;
    }
    return formatPrimer(primer, position);
  });
  return out.filter((p) => p !== null);
}

export function pcrPrimerPositionsInInput(source) {
  if (source.type !== 'PCRSource') {
    throw new Error('Source is not a PCRSource');
  }
  const fwd = { ...source.assembly[0].right.location };
  fwd.end -= 1;
  fwd.strand = 1;
  const rvs = { ...source.assembly[1].left.location };
  rvs.end -= 1;
  rvs.strand = -1;
  return [fwd, rvs];
}

export function pcrPrimerPositionsInOutput(primers, entity) {
  const sequenceData = convertToTeselaJson(entity);
  const [fwdPrimer, rvsPrimer] = primers;
  return [
    { start: 0, end: fwdPrimer.sequence.length - 1, strand: 1 },
    { start: sequenceData.size - rvsPrimer.sequence.length, end: sequenceData.size - 1, strand: -1 },
  ];
}

export function getPCRPrimers({ primers, sources, entities }, entityId) {
  // The same sequence can be used as input in multiple PCRs
  const sourcesInput = sources.filter((s) => s.input.includes(entityId));
  const sourceOutput = sources.find((s) => s.output === entityId);
  let out = [];
  sourcesInput.forEach((sourceInput) => {
    if (sourceInput?.type === 'PCRSource' && sourceInput.assembly?.length === 2) {
      const pcrPrimers = [sourceInput.assembly[0].left.sequence, sourceInput.assembly[1].right.sequence].map((id) => primers.find((p) => p.id === id));
      const primerPositions = pcrPrimerPositionsInInput(sourceInput);
      out = out.concat(pcrPrimers.map((primer, i) => formatPrimer(primer, primerPositions[i])));
    }
  });
  if (sourceOutput?.type === 'PCRSource') {
    const pcrPrimers = [sourceOutput.assembly[0].left.sequence, sourceOutput.assembly[1].right.sequence].map((id) => primers.find((p) => p.id === id));
    const entity = entities.find((e) => e.id === entityId);
    const primerPositions = pcrPrimerPositionsInOutput(pcrPrimers, entity);
    out = out.concat(pcrPrimers.map((primer, i) => formatPrimer(primer, primerPositions[i])));
  }
  return out;
}
