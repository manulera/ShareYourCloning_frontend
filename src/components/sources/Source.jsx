import React from 'react';
import SourceFile from './SourceFile';
import SourceGenBank from './SourceGenBank';
import SourceRestriction from './SourceRestriction';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
// TODO
// You should be able to chose based on the input. No input -> only file or request
// An input -> no file nor request, but the others yes

// There are several types of source, this components holds the common part,
// which for now is a select element to pick which kind of source is created
function Source({
  source, updateSource, getEntityFromId, idsEntitiesNotChildSource,
}) {
  function onChange(event) {
    const newSource = {
      ...source,
      type: event.target.value,
    };
    updateSource(newSource);
  }
  let specificSource = null;
  if (source.type !== null) {
    if (source.type === 'file') {
      specificSource = <SourceFile {...{ source, updateSource }} />;
    }
    if (source.type === 'restriction') {
      specificSource = (
        <div>
          <SourceRestriction {...{ source, updateSource, getEntityFromId }} />
          <MultipleOutputsSelector {...{ source, updateSource }} />
        </div>
      );
    }
    if (source.type === 'genbank_id') {
      specificSource = (
        <SourceGenBank {...{ source, updateSource, getEntityFromId }} />
      );
    }
    if (source.type === 'ligation') {
      specificSource = (
        <div>
          <MultipleInputsSelector {...{ source, updateSource, idsEntitiesNotChildSource }} />
          {/* <SourceLigation {...{ source, updateSource, getEntityFromId }} /> */}
          <MultipleOutputsSelector {...{ source, updateSource }} />
        </div>
      );
    }
  }
  const selectElementId = `select_source_${source.id}`;
  const chooseSourceMessage = source.type !== null ? null : 'Choose a source';
  return (
    <div className="select-source">
      <div id="icon">
        X
      </div>
      <label htmlFor="select_source">
        {chooseSourceMessage}
        <br />
        <select value={source.type} onChange={onChange} id={selectElementId}>
          <option value=" " />
          <option value="file">file</option>
          <option value="restriction">Restriction</option>
          <option value="genbank_id">GenBank ID</option>
          <option value="ligation">Ligation</option>
        </select>
      </label>
      {specificSource}
    </div>
  );
}

export default Source;
