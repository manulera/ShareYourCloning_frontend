import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, FormControl, TextField } from '@mui/material';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

// A component providing an interface for the user to perform a restriction reaction
// with one or more restriction enzymes, move between output fragments, and eventually
// select one as an output.
function SourceRestriction({ sourceId }) {
  const enzymesCsvRef = React.useRef('');
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const { waitingMessage, sources, entities, sendRequest } = useBackendAPI(sourceId);

  const onSubmit = (event) => {
    event.preventDefault();
    if (enzymesCsvRef.current === '') {
      // TODO add form validation
      return;
    }

    const requestData = {
      source: { restriction_enzymes: enzymesCsvRef.current.value.split(','), input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    sendRequest('restriction', requestData);
  };

  return (
    <div className="restriction">
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <TextField
            label="Enzymes (comma-separated)"
            id={`repository-id-${sourceId}`}
            inputRef={enzymesCsvRef}
            helperText="Example: EcoRI,BamHI"
          />
        </FormControl>
        <Button type="submit" variant="contained" color="success">Perform restriction</Button>
      </form>

      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourceRestriction;
