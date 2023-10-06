import React from 'react';
import axios from 'axios';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import error2String from './error2String';

function SourcePCR({
  sourceId, updateSource, inputEntities, primers,
}) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [selectedPrimerIds, setSelectedPrimersIds] = React.useState([]);
  const [sources, setSources] = React.useState('');
  const [entities, setEntities] = React.useState('');

  const onChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    setSelectedPrimersIds(value);
  };

  const commitSource = (index) => updateSource({ ...sources[index], id: sourceId }, entities[index]);

  const onSubmit = (event) => {
    event.preventDefault();
    setWaitingMessage('Request sent to the server');
    const requestData = {
      sequences: inputEntities,
      primers: primers.filter((p) => selectedPrimerIds.includes(p.id)),
      source: {
        input: inputEntities.map((e) => e.id),
        primer_annealing_settings: { minimum_annealing: 15 },
      },
    };
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}pcr`, requestData)
      .then((resp) => {
        setWaitingMessage(null);
        // If there is only a single product, commit the result, else allow choosing
        if (resp.data.sources.length === 1) {
          updateSource({ ...resp.data.sources[0], id: sourceId }, resp.data.sequences[0]);
        } else { setSources(resp.data.sources); setEntities(resp.data.sequences); }
      }).catch((error) => { setWaitingMessage(error2String(error)); });
  };

  return (
    <div className="restriction">
      <h3 className="header-nodes">PCR</h3>
      <form onSubmit={onSubmit}>
        <label htmlFor="select_multiple_primers">
          <select multiple="true" value={selectedPrimerIds} id="select_multiple_primers" onChange={onChange}>
            {primers.map((primer) => <option value={primer.id}>{primer.name}</option>)}
          </select>
        </label>
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

export default SourcePCR;
