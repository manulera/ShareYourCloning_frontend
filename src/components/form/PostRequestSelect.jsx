import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Alert, Button, FormControl } from '@mui/material';

export default function PostRequestSelect({ setValue, getOptions, getOptionLabel, isOptionEqualToValue, textLabel }) {
  const [options, setOptions] = React.useState([]);
  const [connectAttempt, setConnectAttemp] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // user input state
  const [userInput, setUserInput] = React.useState('');
  const [noOptionsText, setNoOptionsText] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
      if (userInput.length >= 3) {
        try {
          const receivedOptions = await getOptions(userInput);
          setOptions(receivedOptions);
          setErrorMessage(null);
          setError(false);
          if (receivedOptions.length === 0) { setNoOptionsText('No results found'); }
        } catch (e) {
          setErrorMessage('Could not retrieve data');
          setError(true);
        }
      } else { setNoOptionsText(''); setOptions([]); }
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
          <Button color="inherit" size="small" onClick={() => { setErrorMessage('Retrying...'); setConnectAttemp(connectAttempt + 1); }}>
            Retry
          </Button>
        )}
      >
        {errorMessage}
      </Alert>
    );
  }
  return (
    <FormControl fullWidth>
      <Autocomplete
        onChange={(event, value) => { setValue(value); }}
        // Change options only when input changes (not when an option is picked)
        onInputChange={(event, newInputValue, reason) => (reason === 'input') && setUserInput(newInputValue)}
        id="tags-standard"
        options={options}
        noOptionsText={noOptionsText || 'Type at least 3 characters to search'}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label={textLabel}
          />
        )}
      />
    </FormControl>
  );
}
