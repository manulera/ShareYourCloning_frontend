import axios from 'axios';
import React from 'react';

// A component representing the ligation of several fragments
function SourceLigation({ source, updateSource, getEntityFromId }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');

  if (source.output_index !== null) {
    return (
      <div>
        Ligation of fragments with sticky ends
      </div>
    );
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source,
      sequences: source.input.map((id) => getEntityFromId(id)),
    };
    // A better way not to have to type twice the output_list thing
    setWaitingMessage('Processing...');
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}sticky_ligation`, requestData)
      .then((resp) => {
        setWaitingMessage('');
        updateSource({ ...resp.data.source, kind: 'source' });
      })
      .catch((error) => {
        if (!error.response) { setWaitingMessage('Unable to connect to the backend server'); } else { setWaitingMessage(error.response.data.detail); }
      });
  };

  return (
    <div className="ligation">

      <form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
    </div>
  );
}

export default SourceLigation;
