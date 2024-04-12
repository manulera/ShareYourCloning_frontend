import React from 'react';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import ValidatedTextField from '../form/ValidatedTextField';
import { stringIsNotDNA } from '../primers/validators';

function SourceManuallyTyped({ sourceId }) {
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);

  const [userInput, setUserInput] = React.useState('');
  const [isCircular, setIsCircular] = React.useState(false);

  const [errorStatus, setErrorStatus] = React.useState({ sequence: true });
  const [touched, setTouched] = React.useState(false);
  const [submissionAttempted, setSubmissionAttempted] = React.useState(false);

  const submissionAllowed = touched && Object.values(errorStatus).every((error) => !error);
  const updateValidationStatus = (fieldName, valid) => {
    setTouched(true);
    // Update the validation status for the given field (taken from the ref.id)
    setErrorStatus((prevErrorStatus) => ({
      ...prevErrorStatus,
      [fieldName]: valid,
    }));
  };

  const onInputChange = (event) => {
    // Remove all non-letter characters on paste
    if (event.nativeEvent.inputType === 'insertFromPaste') {
      setUserInput(event.target.value.replace(/[^a-zA-Z]/g, ''));
    } else {
      setUserInput(event.target.value);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmissionAttempted(true);
    if (submissionAllowed) {
      sendPostRequest('manually_typed', { user_input: userInputRef.current.value, circular: isCircular });
    }
  };

  const sequenceErrorChecker = (s) => (stringIsNotDNA(s) ? { error: true, helperText: 'invalid DNA sequence' } : { error: false, helperText: '' });

  return (
    <form onSubmit={onSubmit}>
      <ValidatedTextField
        fullWidth
        id="sequence"
        label="Sequence"
        variant="outlined"
        value={userInput}
        onInputChange={onInputChange}
        className="sequence"
        submissionAttempted={submissionAttempted}
        required
        errorChecker={sequenceErrorChecker}
        updateValidationStatus={updateValidationStatus}
      />
      <FormControl fullWidth style={{ textAlign: 'left' }}>
        <FormControlLabel control={<Checkbox value={isCircular} onChange={() => setIsCircular(!isCircular)} />} label="Circular DNA" />
      </FormControl>
      <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>
    </form>
  );
}

export default SourceManuallyTyped;
