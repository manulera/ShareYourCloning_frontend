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
