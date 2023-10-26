import React from 'react';
import { Button } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';

// A component provinding an interface to import a file
function SourceFile({ sourceId }) {
  const { waitingMessage, sources, entities, sendRequest } = useBackendAPI(sourceId);
  const onChange = (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    formData.append('file', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    sendRequest('read_from_file', formData, config);
  };

  return (
    <form>
      <Button
        fullWidth
        variant="contained"
        component="label"
      >
        Select File
        <input
          type="file"
          hidden
          onChange={onChange}
        />
      </Button>
      <FormHelperText>Supports .gb, .dna and fasta</FormHelperText>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId,
      }}
      />

    </form>
  );
}

export default SourceFile;
