import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button, TextField } from '@mui/material';
import { FormControl } from '@mui/base';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

// A component representing the ligation or gibson assembly of several fragments
function SourceAssembly({ sourceId, assemblyType }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const inputEntityIds = inputEntities.map((e) => e.id);
  const { waitingMessage, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const minimalHomologyRef = React.useRef(null);
  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    if (assemblyType === 'gibson_assembly') {
      const config = { params: { minimal_homology: minimalHomologyRef.current.value } };
      sendPostRequest('gibson_assembly', requestData, config);
    } else {
      sendPostRequest(assemblyType, requestData);
    }
  };

  return (
    <div className="assembly">
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <MultipleInputsSelector {...{
            inputEntityIds, sourceId, sourceType: assemblyType,
          }}
          />
        </FormControl>
        { (assemblyType === 'gibson_assembly') && (
        // I don't really understand why fullWidth is required here
        <FormControl fullWidth>
          <TextField
            fullWidth
            label="Minimal homology length (in bp)"
            inputRef={minimalHomologyRef}
            type="number"
            defaultValue={20}
          />
        </FormControl>
        )}
        <Button fullWidth type="submit" variant="contained">Submit</Button>
      </form>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourceAssembly;
