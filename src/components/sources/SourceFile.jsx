import axios from 'axios';
import React from 'react';

// A component provinding an interface to import a file
// TODO support multi-sequence files
function SourceFile({ source, updateSource }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');

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
      .post(`${process.env.REACT_APP_BACKEND_URL}read_from_file`, formData, config)
      .then((resp) => {
        setWaitingMessage(null);
        updateSource({ ...resp.data.source, kind: 'source', id: source.id });
      })
      .catch((reason) => console.log(reason));
  };
  return (
    <div>
      <h3 className="header-nodes">Submit a file</h3>
      <p>Ideally a '.gb' or '.dna' file with annotations, but will also take FASTA</p>
      <input type="file" onChange={onChange} />
      <div>{waitingMessage}</div>
    </div>
  );
}

export default SourceFile;
