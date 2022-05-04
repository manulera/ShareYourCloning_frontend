import React from 'react';

function MultipleInputsSelector({
  entityNotChildSourceIds, inputEntityIds, sourceId, updateSource,
}) {
  const onChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    updateSource({ id: sourceId, input: value });
  };
  // The possible options should include the already selected ones + the one without children
  const options = inputEntityIds.concat(entityNotChildSourceIds);
  return (
    <div className="multiple-input-selector">
      <h3>Select several inputs for this step</h3>
      <label htmlFor="select_multiple_inputs">
        <select multiple="true" value={inputEntityIds} onChange={onChange} id="select_multiple_inputs">
          {options.map((id) => <option value={id}>{id}</option>)}
        </select>
      </label>
    </div>
  );
}

export default MultipleInputsSelector;
