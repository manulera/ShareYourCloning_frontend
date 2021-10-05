import React from 'react';

function MultipleInputsSelector({ source, updateSource, idsEntitiesNotChildSource }) {
  const onChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    updateSource({
      ...source,
      input: value,
    });
  };
  // The possible options should include the already selected ones + the one without children
  const allOptions = source.input.concat(idsEntitiesNotChildSource);
  return (
    <div className="multiple-input-selector">
      <label htmlFor="select_multiple_inputs">
        <select multiple="true" value={source.input} onChange={onChange} id="select_multiple_inputs">
          {
      allOptions.map((id) => <option value={id}>{id}</option>)
    }
        </select>
      </label>
    </div>
  );
}

export default MultipleInputsSelector;
