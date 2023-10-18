import React from 'react';
import useBackendAPI from '../../hooks/useBackendAPI';

// A component providing an interface for the user to type a Genbank ID
// and get a sequence
function SourceRepositoryId({ sourceId }) {
  const [selectedRepository, setSelectedRepository] = React.useState('');
  const repositoryIdRef = React.useRef('');
  
  const { waitingMessage, sendRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    sendRequest('repository_id', { repository_id: repositoryIdRef.current.value, repository: selectedRepository })
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
        <input type="text" ref={repositoryIdRef}/>
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
