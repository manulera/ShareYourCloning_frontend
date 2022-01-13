export const downloadStateAsJson = async (entities, sources, description) => {
  // from https://stackoverflow.com/a/55613750/5622322
  const output = { entities, sources, description };
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
  newState, setSources, setEntities, setDescription, setNextUniqueId,
) {
  setSources(newState.sources);
  setEntities(newState.entities);
  setDescription(newState.description);
  // We set the next id to the max +1
  setNextUniqueId(
    1 + newState.sources.concat(newState.entities).reduce(
      (max, item) => Math.max(max, item.id), 0,
    ),
  );
}
