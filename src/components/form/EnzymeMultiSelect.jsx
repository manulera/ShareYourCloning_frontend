import * as React from 'react';
import GetRequestMultiSelect from './GetRequestMultiSelect';

export default function EnzymeMultiSelect({ setEnzymes }) {
  const url = new URL('restriction_enzyme_list', import.meta.env.VITE_REACT_APP_BACKEND_URL).href;
  const getOptionsFromResponse = (data) => data.enzyme_names;
  const label = 'Enzymes used';
  const messages = { loadingMessage: 'retrieving enzymes...', errorMessage: 'Could not retrieve enzymes from server' };
  const onChange = (value) => setEnzymes(value);

  return (
    <GetRequestMultiSelect
      getOptionsFromResponse={getOptionsFromResponse}
      url={url}
      label={label}
      messages={messages}
      onChange={onChange}
      getOptionLabel={(option) => option}
    />
  );
}
