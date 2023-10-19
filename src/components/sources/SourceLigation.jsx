import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

// A component representing the ligation of several fragments
function SourceLigation({ sourceId }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const inputEntityIds = inputEntities.map((e) => e.id);
  const { waitingMessage, sources, entities, sendRequest } = useBackendAPI(sourceId);
  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    sendRequest('sticky_ligation', requestData);
  };

  return (
    <div className="ligation">
      <MultipleInputsSelector {...{
        inputEntityIds, sourceId, sourceType: 'sticky_ligation',
      }}
      />
      <form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </form>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourceLigation;
