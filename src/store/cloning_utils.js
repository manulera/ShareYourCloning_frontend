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
  const inputEntities = state.cloning.entities.filter((entity) => thisSource.input.includes(entity.id))
  return inputEntities.map((entity) => entity.id);
}
