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
  const sequence = entities.find((e) => e.id === source.output);
  if (sequence !== undefined && sequence.type === 'TemplateSequence') {
    return true;
  }
  return false;
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

export function getPrimerLinks({ primers, primer2entityLinks }, entityId) {
  const relatedLinks = primer2entityLinks.filter((link) => link.entityId === entityId);
  return relatedLinks.map(({ position, primerId }) => {
    const { name, sequence, id } = primers.find((p) => p.id === primerId);
    return {
      id: `${id}`,
      name,
      ...position,
      type: 'primer_bind',
      primerBindsOn: '3prime',
      forward: position.strand === 1,
      bases: sequence,
    };
  });
}
