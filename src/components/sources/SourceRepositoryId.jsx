import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Alert, Autocomplete } from '@mui/material';
import axios from 'axios';
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
    case 'euroscarf':
      if (!repositoryId.match(/^P\d+$/)) {
        return 'Euroscarf IDs must be P followed by numbers (e.g. P30174)';
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
  euroscarf: 'P30174',
};

const inputLabels = {
  addgene: 'AddGene ID',
  genbank: 'GenBank ID',
  benchling: 'Benchling URL',
  euroscarf: 'Euroscarf ID',
};

const checkOption = (option, inputValue) => option.name.toLowerCase().includes(inputValue.toLowerCase());
const formatOption = (option, plasmidSet, plasmidSetName) => ({ name: option.name, path: `${plasmidSet}/${option.subpath}`, plasmidSetName, plasmidSet });

function SnapGenePlasmidSelector({ setInputValue }) {
  const url = 'https://raw.githubusercontent.com/manulera/SnapGene_crawler/master/index.json';
  const [userInput, setUserInput] = React.useState('');
  const [data, setData] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  // const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    const fetchOptions = async () => {
      const resp = await axios.get(url);
      setData(resp.data);
    };
    fetchOptions();
  }, []);

  const onInputChange = (newInputValue) => {
    if (newInputValue === undefined) {
      // When clearing the input via x button
      setUserInput('');
      setOptions([]);
      return;
    }
    setUserInput(newInputValue);
    if (newInputValue.length < 3) {
      setOptions([]);
      return;
    }
    // if (filter !== '') {
    //   setOptions(data[filter].plasmids
    //     .filter((option) => checkOption(option, newInputValue))
    //     .map((option) => formatOption(option, filter, data[filter].name)));
    // } else {
    setOptions(Object.entries(data)
      .flatMap(([plasmidSet, category]) => category.plasmids
        .filter((option) => checkOption(option, newInputValue))
        .map((option) => formatOption(option, plasmidSet, data[plasmidSet].name))));
    // }
  };

  if (data === null) {
    return <div>Loading...</div>;
  }

  const selectedOption = options.find((option) => option.name === userInput);

  return (
    <>
      {/* <FormControl fullWidth>
        <InputLabel id="plasmid-set-label">Filter by set</InputLabel>
        <Select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          labelId="plasmid-set-label"
          label="Filter by set"
        >
          <MenuItem key="all" value="">All</MenuItem>
          {Object.keys(data).map((plasmidSet) => (
            <MenuItem key={plasmidSet} value={plasmidSet}>{data[plasmidSet].name}</MenuItem>
          ))}
        </Select>
      </FormControl> */}

      <FormControl fullWidth>
        <Autocomplete
          onChange={(event, value) => { onInputChange(value?.name); value && setInputValue(value.path); }}
        // Change options only when input changes (not when an option is picked)
          onInputChange={(event, newInputValue, reason) => (reason === 'input') && onInputChange(newInputValue)}
          id="tags-standard"
          options={options}
          noOptionsText={(
            <div>
              Type at least 3 characters to search, see
              {' '}
              <a href="https://www.snapgene.com/plasmids" target="_blank" rel="noopener noreferrer">SnapGene plasmids</a>
              {' '}
              for options
            </div>
)}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(o1, o2) => o1.subpath === o2.subpath}
          inputValue={userInput}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Plasmid name"
            />
          )}
        />
      </FormControl>
      {selectedOption && (
        <Alert severity="info" sx={{ mb: 1 }}>
          Plasmid
          {' '}
          <a href={`https://www.snapgene.com/plasmids/${selectedOption.path}`}>{selectedOption.name}</a>
          {' '}
          from set
          {' '}
          <a href={`https://www.snapgene.com/plasmids/${selectedOption.plasmidSet}`}>{selectedOption.plasmidSetName}</a>
        </Alert>
      )}
    </>
  );
}

// A component providing an interface for the user to type a repository ID
// and get a sequence
function SourceRepositoryId({ source, requestStatus, sendPostRequest }) {
  const { id: sourceId } = source;
  const [inputValue, setInputValue] = React.useState('');
  const [selectedRepository, setSelectedRepository] = React.useState(source.repository_name);
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
          <MenuItem value="snapgene">SnapGene</MenuItem>
          <MenuItem value="euroscarf">Euroscarf</MenuItem>
        </Select>
      </FormControl>
      {selectedRepository !== '' && (
        <form onSubmit={onSubmit}>
          {selectedRepository !== 'snapgene' && (
            <>
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
            </>
          )}
          {selectedRepository === 'snapgene' && <SnapGenePlasmidSelector setInputValue={setInputValue} />}
          {inputValue && !error && (<SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>)}

        </form>
      )}
    </>
  );
}

export default SourceRepositoryId;
