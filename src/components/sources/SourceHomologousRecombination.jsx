import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, FormControl, TextField } from '@mui/material';
import SingleInputSelector from './SingleInputSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { cloningActions } from '../../store/cloning';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

// A component representing the ligation of several fragments
function SourceHomologousRecombination({ sourceId }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const { waitingMessage, sources, entities, sendRequest } = useBackendAPI(sourceId);
  const { updateSource } = cloningActions;
  const dispatch = useDispatch();
  const inputEntityIds = inputEntities.map((e) => e.id);
  const minimalHomologyRef = React.useRef(null);
  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntityIds },
      sequences: inputEntities,
    };
    const config = { params: { minimal_homology: minimalHomologyRef.current.value } };
    sendRequest('homologous_recombination', requestData, config);
  };

  const template = inputEntityIds.length > 0 ? inputEntityIds[0] : null;
  const insert = inputEntityIds.length > 1 ? inputEntityIds[1] : null;

  const setTemplate = (event) => dispatch(updateSource({ id: sourceId, input: [Number(event.target.value), insert], type: 'sticky_ligation' }));
  const setInsert = (event) => dispatch(updateSource({ id: sourceId, input: [template, Number(event.target.value)], type: 'sticky_ligation' }));

  return (
    <div className="ligation">
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <SingleInputSelector label="Template sequence" {...{ selectedId: template, onChange: setTemplate, inputEntityIds }} />
        </FormControl>
        <FormControl fullWidth>
          <SingleInputSelector label="Insert sequence" {...{ selectedId: insert, onChange: setInsert, inputEntityIds }} />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Minimal homology length (in bp)"
            inputRef={minimalHomologyRef}
            type="number"
            defaultValue={40}
          />
        </FormControl>
        <Button type="submit" variant="contained" color="success">Recombine</Button>
      </form>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId,
      }}
      />
    </div>
  );
}

export default SourceHomologousRecombination;
