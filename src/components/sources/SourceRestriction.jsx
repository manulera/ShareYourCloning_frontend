import React from 'react';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';


// A component providing an interface for the user to perform a restriction reaction
// with one or more restriction enzymes, move between output fragments, and eventually
// select one as an output.
function SourceRestriction({ sourceId, inputEntities }) {

  const enzymesCsvRef = React.useRef('');
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
      <h3 className="header-nodes">Write the enzyme names as csv</h3>
      <form onSubmit={onSubmit}>
        <input type="text" ref={enzymesCsvRef} />
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

export default SourceRestriction;
