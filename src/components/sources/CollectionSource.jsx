import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import { classNameToEndPointMap } from '../../utils/sourceFunctions';
import ObjectTable from '../ObjectTable';

function CollectionSource({ source }) {
  const { id: sourceId, output, options, image, title, description } = source;
  const [selectedOption, setSelectedOption] = React.useState(null);
  const { requestStatus, sendPostRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    const { source: selectedSource } = options.find((option) => option.name === selectedOption);
    // Delete options field
    const postProcessSource = (s) => {
      const sourceOut = { ...s };
      delete sourceOut.options;
      return sourceOut;
    };
    const endpoint = classNameToEndPointMap[selectedSource.type];
    sendPostRequest(endpoint, { id: sourceId, ...selectedSource }, {}, output, postProcessSource);
  };

  const onChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const selectedOptionObject = options.find((option) => option.name === selectedOption);
  console.log(selectedOptionObject);
  return (
    <div className="collection-source">
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {image && <img src={image} width="50%" alt="Collection source icon" />}
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <InputLabel id="select-collection-source">Select a sequence</InputLabel>
          <Select
            value={selectedOption !== null ? selectedOption : ''}
            onChange={onChange}
            labelId="select-collection-source"
            label="Select a sequence"
          >
            {options.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedOption !== null && (
        <>
          {selectedOptionObject.info && <ObjectTable object={selectedOptionObject.info} />}
          <SubmitButtonBackendAPI requestStatus={requestStatus}>Submit</SubmitButtonBackendAPI>
        </>
        )}
      </form>
    </div>

  );
}

export default CollectionSource;
