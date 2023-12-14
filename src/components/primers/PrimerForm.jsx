import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import ValidatedTextField from '../form/ValidatedTextField';
import { stringIsNotDNA } from './validators';
import './PrimerForm.css';

function PrimerForm({
  primer = { name: '', sequence: '', id: '' }, submitPrimer, cancelForm, existingNames,
}) {
  const [errorStatus, setErrorStatus] = React.useState({ name: true, sequence: true });
  const [touched, setTouched] = React.useState(false);
  const [submissionAttempted, setSubmissionAttempted] = React.useState(false);
  const nameRef = React.useRef(null);
  const sequenceRef = React.useRef(null);
  const updateValidationStatus = (fieldName, valid) => {
    setTouched(true);
    // Update the validation status for the given field (taken from the ref.id)
    setErrorStatus((prevErrorStatus) => ({
      ...prevErrorStatus,
      [fieldName]: valid,
    }));
  };
  const submissionAllowed = touched && Object.values(errorStatus).every((error) => !error);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmissionAttempted(true);
    if (submissionAllowed) {
      submitPrimer({ name: nameRef.current.value, sequence: sequenceRef.current.value });
      cancelForm();
    }
  };

  const sequenceErrorChecker = (s) => (stringIsNotDNA(s) ? { error: true, helperText: 'invalid DNA sequence' } : { error: false, helperText: '' });
  const nameErrorChecker = (s) => (existingNames.includes(s) ? { error: true, helperText: 'name exists' } : { error: false, helperText: '' });

  return (
    <form className="primer-row" onSubmit={onSubmit}>
      <ValidatedTextField
        id="name"
        label="Name"
        variant="outlined"
        inputRef={nameRef}
        sx={{ m: 1, display: { width: '20%' } }}
        submissionAttempted={submissionAttempted}
        defaultValue={primer.name}
        required
        errorChecker={nameErrorChecker}
        updateValidationStatus={updateValidationStatus}
      />
      <ValidatedTextField
        id="sequence"
        label="Sequence"
        variant="outlined"
        inputRef={sequenceRef}
        sx={{ m: 1, display: { width: '60%' } }}
        className="sequence"
        submissionAttempted={submissionAttempted}
        defaultValue={primer.sequence}
        required
        errorChecker={sequenceErrorChecker}
        updateValidationStatus={updateValidationStatus}
      />
      {touched && (
      <IconButton type="submit" sx={{ height: 'fit-content' }}>
        <Tooltip title={submissionAllowed ? 'Save changes' : 'Incorrect values'} arrow placement="top">
          <CheckCircleIcon size={25} className={submissionAllowed ? '' : 'form-invalid'} color={submissionAllowed ? 'success' : 'grey'} />
        </Tooltip>
      </IconButton>
      )}

      <IconButton onClick={cancelForm} type="button" sx={{ height: 'fit-content' }}>
        <Tooltip title="Discard changes" arrow placement="top">
          <CancelIcon color="error" />
        </Tooltip>
      </IconButton>

    </form>
  );
}

export default PrimerForm;
