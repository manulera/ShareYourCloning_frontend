import React from 'react';

function SourceTypeSelector({ sourceId, sourceType, setSourceType }) {
  function onChange(event) {
    setSourceType(event.target.value);
  }
  return (
    <label htmlFor={`select_source_${sourceId}`}>
      Select source
      <br />
      <select value={sourceType !== null ? sourceType : ''} onChange={onChange} id={`select_source_${sourceId}`}>
        <option value=" " />
        <option value="file">file</option>
        <option value="restriction">Restriction</option>
        <option value="repository_id">Repository ID (GenBank, AddGene)</option>
        <option value="sticky_ligation">Ligation with sticky ends</option>
        <option value="PCR">PCR</option>
        <option value="homologous_recombination">Homologous recombination</option>
      </select>
    </label>
  );
}

export default SourceTypeSelector;
