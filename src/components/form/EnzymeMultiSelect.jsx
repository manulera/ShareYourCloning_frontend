import * as React from 'react';
import GetRequestMultiSelect from './GetRequestMultiSelect';
import { backendRoute } from '../../utils/routing';

export default function EnzymeMultiSelect({ setEnzymes }) {
  const url = backendRoute('restriction_enzyme_list');
  const getOptionsFromResponse = (data) => data.enzyme_names;
  const label = 'Enzymes used';
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
      getOptionLabel={(option) => option}
    />
  );
}
