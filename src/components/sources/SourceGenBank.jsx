import axios from 'axios';
import React from 'react';
import error2String from './error2String';

// A component providing an interface for the user to type a Genbank ID
// and get a sequence
function SourceGenBank({ sourceId, updateSource }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [genBankId, setGenBankId] = React.useState('');

  // Function called to update the value of enzymeList
  const onChange = (event) => setGenBankId(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    setWaitingMessage('Requesting sequence to Genbank');
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}genbank_id`, { genbank_id: genBankId })
      .then((resp) => {
        setWaitingMessage(null);
        updateSource({ ...resp.data.sources[0], id: sourceId }, resp.data.sequences[0]);
      })
      .catch((error) => { setWaitingMessage(error2String(error)); });
  };

  return (
    <div className="genbank-id">
      <h3 className="header-nodes">Type a Genbank ID</h3>
      <p>For example: NM_001018957.2</p>
      <form onSubmit={onSubmit}>
        <input type="text" value={genBankId} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
      <div className="waiting-message">{waitingMessage}</div>
    </div>
  );
}

export default SourceGenBank;
