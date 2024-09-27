import * as React from 'react';
import GetRequestMultiSelect from './GetRequestMultiSelect';
import useBackendRoute from '../../hooks/useBackendRoute';

export default function EnzymeMultiSelect({ setEnzymes, label = 'Enzymes used', multiple = true }) {
  const backendRoute = useBackendRoute();
  const url = backendRoute('restriction_enzyme_list');
  const getOptionsFromResponse = (data) => data.enzyme_names;
  const messages = { loadingMessage: 'retrieving enzymes...', errorMessage: 'Could not retrieve enzymes from server' };
  const onChange = (value) => setEnzymes(value);
  return (
    <GetRequestMultiSelect
      className="enzyme-multi-select"
      getOptionsFromResponse={getOptionsFromResponse}
      url={url}
      label={label}
      messages={messages}
      onChange={onChange}
      multiple={multiple}
      getOptionLabel={(option) => option}
    />
  );
}
