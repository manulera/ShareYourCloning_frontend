import React from 'react';
import { useSelector } from 'react-redux';
import { getIdsOfEntitiesWithoutChildSource } from '../../store/cloning_utils';

function SingleInputSelector({ selectedId, onChange }) {
  const options = useSelector(({ cloning }) => getIdsOfEntitiesWithoutChildSource(cloning.sources, cloning.entities));
  options.push(selectedId);
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
