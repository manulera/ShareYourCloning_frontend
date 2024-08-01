import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Alert } from '@mui/material';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

function validateRepositoryId(repositoryId, repository) {
  switch (repository) {
    case 'addgene':
      if (!repositoryId.match(/^\d+/)) {
        return 'AddGene IDs must be numbers (e.g. 39296)';
      }
      break;
    case 'benchling':
      if (!repositoryId.match(/^https:\/\/benchling\.com\/.+\/edit$/)) {
        return 'Use a Benchling URL like https://benchling.com/siverson/f/lib_B94YxDHhQh-cidar-moclo-library/seq_dh1FrJTc-b0015_dh/edit';
      }
      break;
    default:
      break;
  }
  return '';
}

const exampleIds = {
  addgene: '39296',
  genbank: 'NM_001018957.2',
  benchling: '',
};

const inputLabels = {
  addgene: 'AddGene ID',
  genbank: 'GenBank ID',
  benchling: 'Benchling URL',
};

// A component providing an interface for the user to type a repository ID
// and get a sequence
function SourceRepositoryId({ source, requestStatus, sendPostRequest }) {
  const { id: sourceId } = source;
  const [inputValue, setInputValue] = React.useState('');
  const [selectedRepository, setSelectedRepository] = React.useState(source.repository_name || '');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setSelectedRepository(source.repository_name || '');
  }, [source.repository_name]);

  React.useEffect(() => {
    setInputValue('');
    setError('');
  }, [selectedRepository]);

  React.useEffect(() => {
    if (inputValue) {
      setError(validateRepositoryId(inputValue, selectedRepository));
    } else {
      setError('');
    }
  }, [inputValue]);
  const onSubmit = (event) => {
    event.preventDefault();
    let repositoryId = inputValue;
    if (selectedRepository === 'benchling') {
      // Remove /edit from the end of the URL and add .gb
      repositoryId = repositoryId.replace(/\/edit$/, '.gb');
    }
    const requestData = { id: sourceId, repository_id: repositoryId, repository_name: selectedRepository };
    sendPostRequest({ endpoint: `repository_id/${selectedRepository}`, requestData, source });
  };
  const helperText = error || (exampleIds[selectedRepository] && `Example: ${exampleIds[selectedRepository]}`);
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
          <MenuItem value="benchling">Benchling</MenuItem>
        </Select>
      </FormControl>
      {selectedRepository !== '' && (
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <TextField
            label={inputLabels[selectedRepository]}
            id={`repository-id-${sourceId}`}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            helperText={helperText}
            error={error}
          />
        </FormControl>
        {/* Extra info for benchling case */}
        {selectedRepository === 'benchling' && (
          <Alert severity="info" sx={{ mb: 1 }}>
            The sequence must be publicly accessible. Use the URL from a sequence editor page (ending in &quot;/edit&quot;), like
            {' '}
            <a target="_blank" rel="noopener noreferrer" href="https://benchling.com/siverson/f/lib_B94YxDHhQh-cidar-moclo-library/seq_dh1FrJTc-b0015_dh/edit">this example</a>
            .
          </Alert>
        )}
        {inputValue && !error && (<SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>)}
      </form>
      )}
    </>
  );
}

export default SourceRepositoryId;
