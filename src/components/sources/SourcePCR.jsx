import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

function SourcePCR({ sourceId }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const primers = useSelector((state) => state.primers.primers);
  const { waitingMessage, sources, entities, sendRequest } = useBackendAPI(sourceId);
  const [selectedPrimerIds, setSelectedPrimersIds] = React.useState([]);
  const minimalAnnealingRef = React.useRef(null);

  const onChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    setSelectedPrimersIds(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      sequences: inputEntities,
      primers: primers.filter((p) => selectedPrimerIds.includes(p.id)),
      source: { input: inputEntities.map((e) => e.id) },
    };
    sendRequest('pcr', requestData, { params: { minimal_annealing: minimalAnnealingRef.current.value } });
  };

  return (
    <div className="restriction">
      <h3 className="header-nodes">PCR</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="select_multiple_primers">
            <div>Select the primers:</div>
            <select multiple value={selectedPrimerIds} id="select_multiple_primers" onChange={onChange}>
              {primers.map((primer) => <option value={primer.id}>{primer.name}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="minimal_annealing">
            <div>Minimal annealing:</div>
            <input id="minimal_annealing" type="number" ref={minimalAnnealingRef} defaultValue="20" />
          </label>
        </div>
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

export default SourcePCR;
