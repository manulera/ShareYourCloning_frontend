import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Alert, Button, FormControl } from '@mui/material';
import { taxonSuggest } from '../../utils/ncbiRequests';

export default function SpeciesSelect({ setSpecies }) {
  const [options, setOptions] = React.useState([]);
  const [connectAttempt, setConnectAttemp] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [waitingMessage, setWaitingMessage] = React.useState('');
  // user input state
  const [userInput, setUserInput] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
      if (userInput.length >= 3) {
        setWaitingMessage('retrieving species from NCBI...');
        try {
          setOptions(await taxonSuggest(userInput));
          setWaitingMessage(null);
          setError(false);
        } catch (e) {
          setWaitingMessage('Could not retrieve species from NCBI');
          setError(true);
        }
      }
    }
    // Delay the fetch to avoid too many requests
    const timeOutId = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timeOutId);
  }, [userInput, connectAttempt]);

  if (error) {
    return (
      <Alert
        sx={{ alignItems: 'center' }}
        severity="error"
        action={(
          <Button color="inherit" size="small" onClick={() => { setWaitingMessage('Retrying...'); setConnectAttemp(connectAttempt + 1); }}>
            Retry
          </Button>
        )}
      >
        {waitingMessage}
      </Alert>
    );
  }
  return (
    <FormControl fullWidth>
      <Autocomplete
        onChange={(event, value) => { setSpecies(value); }}
        onInputChange={(event, newInputValue) => { setUserInput(newInputValue); }}
        id="tags-standard"
        options={options}
        noOptionsText="Type at least 3 characters to search"
        getOptionLabel={(option) => (option ? `${option.sci_name} - ${option.tax_id}` : '')}
        isOptionEqualToValue={(option, value) => option.tax_id === value.tax_id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Species"
            helperText={waitingMessage}
            error={error}
          />
        )}
      />
    </FormControl>
  );
}
