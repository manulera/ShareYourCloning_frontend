import axios from 'axios';
import React from 'react';
import error2String from './error2String';

// A component providing an interface for the user to type a Genbank ID
// and get a sequence
function SourceRepositoryId({ sourceId, updateSource }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [repositoryId, setRepositoryId] = React.useState('');
  const [selectedRepository, setSelectedRepository] = React.useState('');
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}repository_id`)
    setWaitingMessage(`Requesting sequence to ${selectedRepository}`);
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}repository_id`, { repository_id: repositoryId, repository: selectedRepository })
      .then((resp) => {
        setWaitingMessage(null);
        updateSource({ ...resp.data.sources[0], id: sourceId }, resp.data.sequences[0]);
      })
      .catch((error) => { setWaitingMessage(error2String(error)); });
  };
  const repositorySelector = (
    <label htmlFor={`select_repository_${sourceId}`}>
      Select repository
      <br />
      <select value={selectedRepository} onChange={(event) => setSelectedRepository(event.target.value)} id={`select_repository_${sourceId}`}>
        <option value="" />
        <option value="addgene">AddGene</option>
        <option value="genbank">GenBank</option>
      </select>
    </label>
  );
  // A bit dirty but works for now. TODO refactor
  const idInputField = selectedRepository === '' ? null : (
    <>
      <h3 className="header-nodes">
        Type a
        {' '}
        {selectedRepository}
        {' '}
        ID
      </h3>
      <p>
        For example:
        {' '}
        {selectedRepository === 'genbank' ? 'NM_001018957.2' : '39282'}
      </p>
      <form onSubmit={onSubmit}>
        <input type="text" value={repositoryId} onChange={(event) => setRepositoryId(event.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </>
  );

  return (
    <div className="genbank-id">
      {repositorySelector}
      {idInputField}
      <div className="waiting-message">{waitingMessage}</div>
    </div>
  );
}

export default SourceRepositoryId;
