import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import EnzymeMultiSelect from '../form/EnzymeMultiSelect';
import SubmitButtonBackendAPI from '../form/SubmitButtonBackendAPI';

// A component providing an interface for the user to perform a restriction reaction
// with one or more restriction enzymes, move between output fragments, and eventually
// select one as an output.
function SourceRestriction({ sourceId }) {
  const [enzymes, setEnzymes] = React.useState([]);
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const { requestStatus, sources, entities, sendPostRequest } = useBackendAPI(sourceId);

  const onSubmit = (e) => {
    e.preventDefault();
    if (enzymes.length === 0) { return; }
    const requestData = {
      source: { restriction_enzymes: enzymes, input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    sendPostRequest('restriction', requestData);
  };

  return (
    <div className="restriction">
      <form onSubmit={onSubmit}>
        <EnzymeMultiSelect setEnzymes={setEnzymes} />
        {(enzymes.length > 0) && <SubmitButtonBackendAPI requestStatus={requestStatus} color="success">Perform restriction</SubmitButtonBackendAPI>}
      </form>

      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourceRestriction;
