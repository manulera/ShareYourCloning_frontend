import axios from 'axios';
import React from 'react';
import error2String from './error2String';
import MultipleOutputsSelector from './MultipleOutputsSelector';

// A component provinding an interface to import a file
// TODO support multi-sequence files
function SourceFile({ sourceId, updateSource }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [sources, setSources] = React.useState('');
  const [entities, setEntities] = React.useState('');

  // Commit the selected sequence and source
  const commitSource = (index) => updateSource({ ...sources[index], id: sourceId }, entities[index]);
  const onChange = (event) => {
    setWaitingMessage('Loading your file');
    const files = Array.from(event.target.files);
    const formData = new FormData();
    formData.append('file', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    // TODO: dirty setting of the id of the source because of special case where source is
    // not submitted
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}read_from_file`, formData, config)
      .then((resp) => {
        setWaitingMessage(null);
        // If there is only a single sequence in the file, commit the result, else allow choosing
        if (sources.length === 1) {
          updateSource({ ...resp.data.sources[0], id: sourceId }, resp.data.sequences[0]);
        } else { setSources(resp.data.sources); setEntities(resp.data.sequences); }
      })
      .catch((error) => { setWaitingMessage(error2String(error)); setSources([]); setEntities([]); });
  };

  return (
    <div>
      <h3 className="header-nodes">Submit a file</h3>
      <p>Ideally a '.gb' or '.dna' file with annotations, but will also take FASTA</p>
      <input type="file" onChange={onChange} />
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, commitSource,
      }}
      />

    </div>
  );
}

export default SourceFile;
