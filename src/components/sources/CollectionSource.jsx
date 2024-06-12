import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useDispatch } from 'react-redux';
import useBackendAPI from '../../hooks/useBackendAPI';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';
import { classNameToEndPointMap } from '../../utils/sourceFunctions';
import ObjectTable from '../ObjectTable';
import { cloningActions } from '../../store/cloning';

function CollectionSource({ source }) {
  const { id: sourceId, options, image, title, description } = source;
  const [selectedOption, setSelectedOption] = React.useState(null);
  const { requestStatus, sendPostRequest } = useBackendAPI();
  const dispatch = useDispatch();
  const { replaceSource } = cloningActions;

  const onSubmit = (event) => {
    event.preventDefault();
    const { source: selectedSource } = options.find((option) => option.name === selectedOption);
    // Delete options field
    const modifySource = (s) => {
      const sourceOut = { ...s };
      delete sourceOut.options;
      return sourceOut;
    };
    const endpoint = classNameToEndPointMap[selectedSource.type];
    const requestData = { id: sourceId, ...selectedSource };
    sendPostRequest({ endpoint, requestData, source, modifySource });
  };

  const onChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const turnIntoBlankSource = () => {
    setSelectedOption(null);
    dispatch(replaceSource({
      id: sourceId,
      input: [],
      output: source.output,
      type: null,
    }));
  };

  const selectedOptionObject = options.find((option) => option.name === selectedOption);
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
            // Limits the height of the dropdown (adds scroll)
            MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
          >
            <MenuItem onClick={turnIntoBlankSource} value="">
              <AddCircleIcon color="success" />
              <em style={{ marginLeft: 8 }}>Add your own</em>
            </MenuItem>
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
