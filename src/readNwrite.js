export const downloadStateAsJson = async (entities, sources, description, primers) => {
  // from https://stackoverflow.com/a/55613750/5622322
  const output = {
    sequences: entities, sources, description, primers,
  };
  // json
  const fileName = 'file';
  const json = JSON.stringify(output);
  const blob = new Blob([json], { type: 'application/json' });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function loadStateFromJson(
  newState, setSources, setEntities, setDescription, setNextUniqueId, setPrimers,
) {
  // TODO rename entities to sequences
  setPrimers(newState.primers);
  setSources(newState.sources);
  setEntities(newState.sequences);
  setDescription(newState.description);
  // We set the next id to the max +1
  setNextUniqueId(
    1 + newState.sources.concat(newState.sequences).reduce(
      (max, item) => Math.max(max, item.id), 0,
    ),
  );
}
