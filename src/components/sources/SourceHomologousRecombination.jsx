import axios from 'axios';
import React from 'react';
import error2String from './error2String';
import SingleInputSelector from './SingleInputSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';

// A component representing the ligation of several fragments
function SourceHomologousRecombination({
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
      source: { input: inputEntityIds },
      sequences: inputEntities,
    };
    setWaitingMessage('Processing...');
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}homologous_recombination`, requestData, {minimal_homology: 40})
      .then((resp) => {
        setWaitingMessage(null);
        // If there is only a single product, commit the result, else allow choosing
        if (resp.data.sources.length === 1) {
          updateSource({ ...resp.data.sources[0], id: sourceId }, resp.data.sequences[0]);
        } else { setSources(resp.data.sources); setEntities(resp.data.sequences); }
      }).catch((error) => { setWaitingMessage(error2String(error)); });
  };

  const template = inputEntityIds.length > 0 ? inputEntityIds[0] : null;
  const insert = inputEntityIds.length > 1 ? inputEntityIds[1] : null;
  const options = inputEntityIds.concat(entityNotChildSourceIds);

  const setTemplate = (event) => updateSource({ id: sourceId, input: [Number(event.target.value), insert], type: 'sticky_ligation' });
  const setInsert = (event) => updateSource({ id: sourceId, input: [template, Number(event.target.value)], type: 'sticky_ligation' });


  return (
    <div className="ligation">

      <div>Select template:</div>
      <SingleInputSelector {...{
        options, selectedId: template, onChange: setTemplate,
      }}
      />

      <div>Select insert:</div>
      <SingleInputSelector {...{
        options, selectedId: insert, onChange: setInsert,
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

export default SourceHomologousRecombination;
