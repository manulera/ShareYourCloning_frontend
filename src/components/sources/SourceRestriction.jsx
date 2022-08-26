import React from 'react';
import axios from 'axios';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import error2String from './error2String';

// A component providing an interface for the user to perform a restriction reaction
// with one or more restriction enzymes, move between output fragments, and eventually
// select one as an output.
function SourceRestriction({ sourceId, updateSource, inputEntities }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [enzymesCSV, setenzymesCSV] = React.useState([]);
  const [sources, setSources] = React.useState('');
  const [entities, setEntities] = React.useState('');

  // Function called to update the value of enzymesCSV
  const onChange = (event) => setenzymesCSV(event.target.value);
  const commitSource = (index) => updateSource({ ...sources[index], id: sourceId }, entities[index]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (enzymesCSV.length === 0) {
      setWaitingMessage('No enzyme names provided');
      return;
    }
    setWaitingMessage('Request sent to the server');
    const requestData = {
      source: { restriction_enzymes: enzymesCSV.split(','), input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}restriction`, requestData)
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
      <h3 className="header-nodes">Write the enzyme names as csv</h3>
      <form onSubmit={onSubmit}>
        <input type="text" value={enzymesCSV} onChange={onChange} />
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

export default SourceRestriction;
