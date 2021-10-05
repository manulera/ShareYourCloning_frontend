import React from 'react';

function ShareYourCloningBox({
  entities, sources, setEntities, setSources,
}) {
  const [headerText, setHeaderText] = React.useState('Share Your Cloning');

  const downloadStateAsJson = async () => {
    // from https://stackoverflow.com/a/55613750/5622322
    const output = { entities, sources };
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

  // Functions to allow to drop on the h1 element
  const onDragOver = (event) => {
    event.preventDefault();
    setHeaderText('Load Your Cloning');
  };
  const ondragleave = (event) => {
    event.preventDefault();
    setHeaderText('Share Your Cloning');
  };
  const loadStateFromJson = (event) => {
    event.stopPropagation(); event.preventDefault();
    const { files } = event.dataTransfer;
    const reader = new FileReader();
    reader.onload = (eventFileRead) => {
      const newState = JSON.parse(eventFileRead.target.result);
      setSources(newState.sources);
      setEntities(newState.entities);
    };
    reader.readAsText(files[0]);
  };

  return (
    <h1
      onClick={downloadStateAsJson}
      onDrop={loadStateFromJson}
      onDragOver={onDragOver}
      onDragLeave={ondragleave}
    >
      {headerText}
    </h1>
  );
}

export default ShareYourCloningBox;
