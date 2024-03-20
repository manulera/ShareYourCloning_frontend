import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

// A component provinding an interface to import a file
function SourceFile({ sourceId }) {
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const onChange = (event) => {
    const files = Array.from(event.target.files);
    console.log('file', files[0]);
    const formData = new FormData();
    formData.append('file', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    sendPostRequest('read_from_file', formData, config);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
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
        <FormHelperText>Supports .gb, .dna and fasta</FormHelperText>
      </form>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId,
      }}
      />
    </>
  );
}

export default SourceFile;
