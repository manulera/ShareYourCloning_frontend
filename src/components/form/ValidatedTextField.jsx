import { TextField } from '@mui/material';
import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';

function ValidatedTextField({ id, value, onInputChange, errorChecker, updateValidationStatus, required, submissionAttempted, floatingHelperText, initialHelperText = '', ...rest }) {
  const defaultPars = { inputProps: { style: { fontSize: 14 } }, FormHelperTextProps: { component: 'div' } };
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(initialHelperText);
  const [touched, setTouched] = React.useState(false);

  const handleChange = (event) => {
    onInputChange(event);
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
      updateValidationStatus(id, true);
      return;
    }
    const { error: newError, helperText: newHelperText } = errorChecker(value);
    setError(newError);
    setHelperText(newHelperText);
    updateValidationStatus(id, newError);
  }, [value, touched, submissionAttempted]);
  const renderedHelperText = floatingHelperText ? formHelperFormatted(helperText) : helperText;
  return (<TextField id={id} value={value} {...defaultPars} {...rest} onChange={handleChange} error={error} helperText={renderedHelperText} />);
}

export default ValidatedTextField;
