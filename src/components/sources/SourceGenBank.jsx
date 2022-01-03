import axios from 'axios';
import React from 'react';

// A component providing an interface for the user to type a Genbank ID
// and get a sequence
function SourceGenBank({ source, updateSource }) {
  if (source.output !== null) {
    const urlGenBank = `https://www.ncbi.nlm.nih.gov/nuccore/${source.genbank_id}`;
    return (
      <div>
        Request to GenBank with ID
        {' '}
        <strong>
          <a href={urlGenBank}>
            {source.genbank_id}
          </a>
        </strong>
      </div>
    );
  }
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [genBankId, setGenBankId] = React.useState('');

  // Function called to update the value of enzymeList
  const onChange = (event) => setGenBankId(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    setWaitingMessage('Requesting sequence to Genbank');
    const newSource = {
      ...source,
      genbank_id: genBankId,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}genebank_id`, newSource)
      .then((resp) => {
        setWaitingMessage(null);
        updateSource({ ...resp.data.source, kind: 'source' });
      })
      .catch((reason) => console.log(reason));
  };

  return (
    <div className="genbank-id">
      <h3 className="header-nodes">Type a Genbank ID</h3>
      <p>For example: NM_001018957.2</p>
      <form onSubmit={onSubmit}>
        <input type="text" value={genBankId} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
    </div>
  );
}

export default SourceGenBank;
