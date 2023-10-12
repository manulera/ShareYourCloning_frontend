import axios from 'axios';
import React from 'react';
import error2String from './error2String';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';

// A component representing the ligation of several fragments
function SourceLigation({
  sourceId, updateSource, inputEntities, entitiesNotChildSource,
}) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [sources, setSources] = React.useState('');
  const [entities, setEntities] = React.useState('');
  const entityNotChildSourceIds = entitiesNotChildSource.map((e) => e.id);
  const inputEntityIds = inputEntities.map((e) => e.id);

  const commitSource = (index) => {
    updateSource({ ...sources[index], id: sourceId }, entities[index]);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    setWaitingMessage('Processing...');
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}sticky_ligation`, requestData)
      .then((resp) => {
        setWaitingMessage(null);
        // If there is only a single product, commit the result, else allow choosing
        if (resp.data.sources.length === 1) {
          updateSource({ ...resp.data.sources[0], id: sourceId }, resp.data.sequences[0]);
        } else { setSources(resp.data.sources); setEntities(resp.data.sequences); }
      }).catch((error) => { setWaitingMessage(error2String(error)); });
  };

  return (
    <div className="ligation">
      <MultipleInputsSelector {...{
        entityNotChildSourceIds, inputEntityIds, sourceId, updateSource, sourceType: 'sticky_ligation',
      }}
      />
      <form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, commitSource, inputEntities,
      }}
      />
    </div>
  );
}

export default SourceLigation;
