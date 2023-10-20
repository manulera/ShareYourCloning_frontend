import React from 'react';
import ValidatedTextField from '../form/ValidatedTextField';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { stringIsNotDNA } from './validators';

function PrimerForm({
  primer = { name: '', sequence: '', id: '' }, submitPrimer, cancelForm, existingNames
}) {
  const [validationStatus, setValidationStatus] = React.useState({ name: false, sequence: false });
  const [touched, setTouched] = React.useState(false);
  const [submissionAttempted, setSubmissionAttempted] = React.useState(false);
  const nameRef = React.useRef(null);
  const sequenceRef = React.useRef(null);
  const updateValidationStatus = (fieldName, valid) => {
    setTouched(true);
    // Update the validation status for the given field (taken from the ref.id)
    setValidationStatus((prevValidationStatus) => ({
      ...prevValidationStatus,
      [fieldName]: valid,
    }));
  };

  const submissionAllowed = touched && Object.values(validationStatus).every((error) => !error);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmissionAttempted(true);
    if (submissionAllowed) {
      submitPrimer({ name: nameRef.current.value, sequence: sequenceRef.current.value });
      cancelForm();
    }
  };

  const sequenceValidator = (s) => ((stringIsNotDNA(s) || s.length === 0) ? { error: true, helperText: 'invalid DNA sequence' } : { error: false, helperText: '' });
  const nameValidator = (s) => (existingNames.includes(s) ? { error: true, helperText: 'name exists' } : { error: false, helperText: '' });

  return (
    <form className="primer-row" onSubmit={onSubmit}>
      <ValidatedTextField
        id="name" label="Name" variant="outlined" inputRef={nameRef} sx={{ m: 1, display: { width: '20%' } }}
        submissionAttempted={submissionAttempted} defaultValue={primer.name} required validator={nameValidator} updateValidationStatus={updateValidationStatus}
      />
      <ValidatedTextField
        id="sequence" label="Sequence" variant="outlined" inputRef={sequenceRef} sx={{ m: 1, display: { width: "60%" } }} className="sequence"
        submissionAttempted={submissionAttempted} defaultValue={primer.sequence} required validator={sequenceValidator} updateValidationStatus={updateValidationStatus}
      />
      {touched && (
        <button type="submit" className="icon-hanging">
          <Tooltip title={submissionAllowed ? 'Save changes' : 'Incorrect values'} arrow placement="top">
            <Box sx={{ m: 1 }}>
              <FaCheckCircle size={25} color={submissionAllowed ? 'green' : 'grey'} />
            </Box>
          </Tooltip>
        </button>
      )}
      <button type="button" className="icon-hanging" onClick={cancelForm}>
        <Tooltip title="Discard changes" arrow placement="top">
          <Box sx={{ m: 1 }}>
            <FaTimesCircle size={25} color="red" />
          </Box>
        </Tooltip>
      </button>
    </form>
  );
}

export default PrimerForm;
