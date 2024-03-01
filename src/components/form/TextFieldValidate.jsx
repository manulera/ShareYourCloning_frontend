import React from 'react';
import { FormControl, TextField } from '@mui/material';

export default function TextFieldValidate({ getterFunction, onChange, label, defaultHelperText = '' }) {
  const [helperText, setHelperText] = React.useState('');
  const [userInput, setUserInput] = React.useState('');
  const [assemblyExists, setAssemblyExists] = React.useState(null);

  React.useEffect(() => {
    // Validate assemblyId with a 500ms delay
    if ((userInput !== '')) {
      setHelperText(`Validating ${label}...`);
      const timeOutId = setTimeout(async () => {
        const resp = await getterFunction(userInput);
        if (resp === null) {
          setHelperText(`${label} does not exist`);
          setAssemblyExists(false);
        } else {
          setHelperText('');
          setAssemblyExists(true);
        }
        onChange(userInput, resp);
      }, 500);
      return () => clearTimeout(timeOutId);
    }
    // Also set to null if assemblyId is empty
    setHelperText(defaultHelperText);
    setAssemblyExists(null);
    return () => {};
  }, [userInput]);

  return (
    <FormControl fullWidth>
      <TextField
        label={label}
        value={userInput}
        error={assemblyExists === false}
        helperText={helperText}
        onChange={(event) => setUserInput(event.target.value)}
      />
    </FormControl>

  );
}
