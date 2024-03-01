import React from 'react';
import { TextField } from '@mui/material';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

function SourceManuallyTyped({ sourceId }) {
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);

  const userInputRef = React.useRef(null);

  const onSubmit = (event) => {
    event.preventDefault();
    sendPostRequest('manually_typed', { user_input: userInputRef.current.value });
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="Sequence"
        inputRef={userInputRef}
      />
      <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>
    </form>
  );
}

export default SourceManuallyTyped;
