import React from 'react';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import ValidatedTextField from '../form/ValidatedTextField';
import { stringIsNotDNA } from '../primers/validators';

function SourceManuallyTyped({ sourceId }) {
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);

  const userInputRef = React.useRef(null);
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

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmissionAttempted(true);
    if (submissionAllowed) {
      sendPostRequest('manually_typed', { user_input: userInputRef.current.value });
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
        inputRef={userInputRef}
        className="sequence"
        submissionAttempted={submissionAttempted}
        required
        errorChecker={sequenceErrorChecker}
        updateValidationStatus={updateValidationStatus}
      />
      <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>
    </form>
  );
}

export default SourceManuallyTyped;
