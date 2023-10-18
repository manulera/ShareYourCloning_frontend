import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';

function SourceTypeSelector({ sourceId, sourceType, setSourceType }) {
  function onChange(event) {
    setSourceType(event.target.value);
  }
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const hasInputEntities = inputEntities.length > 0;
  const options = !hasInputEntities ? (
    <>
      <option value="file">file</option>
      <option value="repository_id">Repository ID (GenBank, AddGene)</option>
    </>
  ) : (
    <>
      <option value="restriction">Restriction</option>
      <option value="sticky_ligation">Ligation with sticky ends</option>
      <option value="PCR">PCR</option>
      <option value="homologous_recombination">Homologous recombination</option>
    </>
  );


  return (
    <label htmlFor={`select_source_${sourceId}`}>
      Select source
      <br />
      <select value={sourceType !== null ? sourceType : ''} onChange={onChange} id={`select_source_${sourceId}`}>
        <option value=" " />
        {options}
      </select>
    </label>
  );
}

export default SourceTypeSelector;
