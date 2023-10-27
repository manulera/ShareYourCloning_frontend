import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Alert, Button, FormControl } from '@mui/material';

export default function EnzymeMultiSelect({ setEnzymes }) {
  const [options, setOptions] = React.useState([]);
  const [connectAttempt, setConnectAttemp] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [waitingMessage, setWaitingMessage] = React.useState('retrieving enzyme list from server...');
  React.useEffect(() => {
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}restriction_enzyme_list`;
    axios
      .get(url).then(({ data }) => {
        setWaitingMessage(null);
        setOptions(data.enzyme_names);
        setError(false);
      }).catch((e) => { setWaitingMessage('Could not retrieve enzymes from server'); setError(true); });
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
    <>
      <FormControl fullWidth>
        <Autocomplete
          multiple
          onChange={(event, value) => { setEnzymes(value); }}
          id="tags-standard"
          options={options}
          getOptionLabel={(option) => option}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Enzymes used"
              helperText={waitingMessage}
              error={error}
            />
          )}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="success">Perform restriction</Button>
    </>
  );
}
