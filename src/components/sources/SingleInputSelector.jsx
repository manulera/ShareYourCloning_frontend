import React from 'react';

function SingleInputSelector({
  options, selectedId, onChange
}) {

  return (
    <div className="single-input-selector">
      <label htmlFor="select_single_inputs">
        <select value={selectedId} onChange={onChange} id="select_single_inputs">
          {options.map((id) => <option key={id} value={id}>{id}</option>)}
        </select>
      </label>
    </div>
  );
}

export default SingleInputSelector;
