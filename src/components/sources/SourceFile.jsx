import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

// A component providing an interface to import a file
function SourceFile({ source, requestStatus, sendPostRequest }) {
  const { id: sourceId } = source;
  const [circularize, setCircularize] = React.useState(false);
  const onChange = (event) => {
    const files = Array.from(event.target.files);
    const requestData = new FormData();
    requestData.append('file', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      params: { circularize },
    };
    sendPostRequest({ endpoint: 'read_from_file', requestData, config, source });
  };

  return (
    <form className="submit-sequence-file" onSubmit={(e) => e.preventDefault()}>
      <FormControl fullWidth>
        <FormControlLabel control={<Checkbox checked={circularize} onChange={() => setCircularize(!circularize)} />} label="Circularize (FASTA only)" />
      </FormControl>
      <SubmitButtonBackendAPI
        component="label"
        requestStatus={requestStatus}
      >
        Select File
        <input
          type="file"
          hidden
          onChange={onChange}
        />
      </SubmitButtonBackendAPI>
      <FormHelperText>Supports .gb, .dna, .embl and fasta</FormHelperText>
    </form>
  );
}

export default SourceFile;
