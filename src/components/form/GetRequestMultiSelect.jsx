import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Alert, Button, FormControl } from '@mui/material';

export default function GetRequestMultiSelect({ getOptionsFromResponse, url, label, messages, onChange, multiple = true, getOptionLabel }) {
  const { loadingMessage, errorMessage } = messages;
  const [options, setOptions] = React.useState([]);
  const [connectAttempt, setConnectAttemp] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [waitingMessage, setWaitingMessage] = React.useState(loadingMessage);
  React.useEffect(() => {
    console.log(url);
    // Built like this in case trailing slash
    axios
      .get(url).then(({ data }) => {
        setWaitingMessage(null);
        setOptions(getOptionsFromResponse(data));
        setError(false);
      }).catch((e) => { setWaitingMessage(errorMessage); setError(true); });
  }, [connectAttempt]);

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
        multiple={multiple}
        onChange={(event, value) => { onChange(value); }}
        id="tags-standard"
        options={options}
        getOptionLabel={getOptionLabel}
        defaultValue={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            helperText={waitingMessage}
            error={error}
          />
        )}
      />
    </FormControl>
  );
}
