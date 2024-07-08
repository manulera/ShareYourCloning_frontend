import React from 'react';
import { FormControl, TextField } from '@mui/material';

export default function TextFieldValidate({ getterFunction, onChange, label, defaultHelperText = '' }) {
  const [helperText, setHelperText] = React.useState('');
  const [userInput, setUserInput] = React.useState('');
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    // Send an empty response to clear the form
    onChange('', null);
    // Validate assemblyId with a 500ms delay
    if ((userInput !== '')) {
      setHelperText(`Validating ${label}...`);
      const timeOutId = setTimeout(async () => {
        const resp = await getterFunction(userInput);
        if (resp === null) {
          setHelperText(`${label} does not exist`);
          setError(true);
        } else {
          setHelperText('');
          setError(false);
        }
        onChange(userInput, resp);
      }, 500);
      return () => clearTimeout(timeOutId);
    }
    // Also set to null if assemblyId is empty
    setHelperText(defaultHelperText);
    setError(false);
    return () => {};
  }, [userInput]);

  return (
    <FormControl fullWidth>
      <TextField
        label={label}
        value={userInput}
        error={error}
        helperText={helperText}
        onChange={(event) => { setUserInput(event.target.value); }}
      />
    </FormControl>

  );
}
