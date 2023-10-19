import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloningActions } from '../../store/cloning';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

function MultipleInputsSelector({
  inputEntityIds, sourceId, sourceType,
}) {
  const dispatch = useDispatch();
  const { updateSource } = cloningActions;

  const onChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    dispatch(updateSource({ id: sourceId, input: value, type: sourceType }));
  };
  const entityNotChildSourceIds = useSelector(({ cloning }) => getIdsOfEntitiesWithoutChildSource(cloning.sources, cloning.entities));
  
  // The possible options should include the already selected ones + the one without children
  const options = inputEntityIds.concat(entityNotChildSourceIds);
  return (
    <div className="multiple-input-selector">
      <h3>Select several inputs for this step</h3>
      <label htmlFor="select_multiple_inputs">
        <select multiple value={inputEntityIds} onChange={onChange} id="select_multiple_inputs">
          {options.map((id) => <option key={id} value={id}>{id}</option>)}
        </select>
      </label>
    </div>
  );
}

export default MultipleInputsSelector;
