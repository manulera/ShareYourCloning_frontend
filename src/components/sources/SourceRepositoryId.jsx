import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

// A component providing an interface for the user to type a repository ID
// and get a sequence
function SourceRepositoryId({ source }) {
  const { id: sourceId } = source;
  const [selectedRepository, setSelectedRepository] = React.useState(source.repository_name || '');
  React.useEffect(() => {
    setSelectedRepository(source.repository_name);
  }, [source.repository_name]);
  const repositoryIdRef = React.useRef(null);
  const [error, setError] = React.useState(false);
  const { requestStatus, sendPostRequest } = useBackendAPI();
  const onSubmit = (event) => {
    event.preventDefault();
    if (repositoryIdRef.current.value === '') {
      setError(true);
    } else {
      setError(false);
      const requestData = { id: sourceId, repository_id: repositoryIdRef.current.value, repository_name: selectedRepository };
      sendPostRequest({ endpoint: `repository_id/${selectedRepository}`, requestData, source });
    }
  };
  const helperText = error ? 'Field cannot be empty' : `Example ID: ${(selectedRepository === 'genbank') ? 'NM_001018957.2' : '39282'}`;
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={`select-repository-${sourceId}-label`}>Select repository</InputLabel>
        <Select
          value={selectedRepository}
          onChange={(event) => setSelectedRepository(event.target.value)}
          labelId={`select-repository-${sourceId}-label`}
          label="Select repository"
        >
          <MenuItem value="addgene">AddGene</MenuItem>
          <MenuItem value="genbank">GenBank</MenuItem>
        </Select>
      </FormControl>
      {selectedRepository !== '' && (
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <TextField
            label="ID in repository"
            id={`repository-id-${sourceId}`}
            inputRef={repositoryIdRef}
            helperText={helperText}
            error={error}
          />
        </FormControl>
        <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>
      </form>
      )}
    </>
  );
}

export default SourceRepositoryId;
