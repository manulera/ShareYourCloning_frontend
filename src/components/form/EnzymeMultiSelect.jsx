import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import error2String from '../../utils/error2String';

export default function EnzymeMultiSelect({ setEnzymes }) {
  const [options, setOptions] = React.useState([]);
  const [waitingMessage, setWaitingMessage] = React.useState('retrieving enzyme list from server...');
  React.useEffect(() => {
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}restriction_enzyme_list`;
    axios
      .get(url).then(({ data }) => {
        setWaitingMessage(null);
        setOptions(data.enzyme_names);
      }).catch((error) => { setWaitingMessage(error2String(error)); });
  }, []);
  return (
    <>
      {waitingMessage}

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
          />
        )}
      />
    </>
  );
}
