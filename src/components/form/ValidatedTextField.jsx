import { TextField } from '@mui/material';
import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';

function ValidatedTextField({ inputRef, errorChecker, updateValidationStatus, required, submissionAttempted, ...rest }) {
  const defaultPars = { inputProps: { style: { fontSize: 14 } }, FormHelperTextProps: { component: 'div' } };
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');
  const [value, setValue] = React.useState(rest.defaultValue || '');
  const [touched, setTouched] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
    setTouched(true);
  };

  const formHelperFormatted = (str) => (
    // component: 'div' because of https://github.com/mui/material-ui/issues/32289
    <FormHelperText component="div" style={{ fontSize: 'x-small', marginLeft: 0, marginRight: 0, position: 'absolute', botom: '0px' }}>{str}</FormHelperText>
  );

  React.useEffect(() => {
    if (!submissionAttempted && !touched) return;
    if (required && value.length === 0) {
      setError(true);
      setHelperText('Field required');
      updateValidationStatus(inputRef.current.id, true);
      return;
    }
    const { error: newError, helperText: newHelperText } = errorChecker(value);
    setError(newError);
    setHelperText(newHelperText);
    updateValidationStatus(inputRef.current.id, newError);
  }, [value, touched, submissionAttempted]);

  return (<TextField inputRef={inputRef} {...defaultPars} {...rest} onChange={handleChange} error={error} helperText={formHelperFormatted(helperText)} />);
}

export default ValidatedTextField;
