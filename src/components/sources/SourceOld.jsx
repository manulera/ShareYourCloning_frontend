import React from 'react';

import { FaTrashAlt } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import SourceFile from './SourceFile';
import SourceGenBank from './SourceGenBank';
import SourceRestriction from './SourceRestriction';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import SourceLigation from './SourceLigation';

// TODO
// You should be able to chose based on the input. No input -> only file or request
// An input -> no file nor request, but the others yes

// There are several types of source, this components holds the common part,
// which for now is a select element to pick which kind of source is created
function Source({
  source, updateSource, getEntityFromId, idsEntitiesNotChildSource, deleteSource,
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
          <MultipleOutputsSelector {...{ source, updateSource, getEntityFromId }} />
        </div>
      );
    }
    if (source.type === 'genbank_id') {
      specificSource = (
        <SourceGenBank {...{ source, updateSource, getEntityFromId }} />
      );
    }
    if (source.type === 'sticky_ligation') {
      const inputSelector = source.output_index !== null ? null
        : <MultipleInputsSelector {...{ source, updateSource, idsEntitiesNotChildSource }} />;
      specificSource = (
        <div>
          {inputSelector}
          <SourceLigation {...{ source, updateSource, getEntityFromId }} />
          <MultipleOutputsSelector {...{ source, updateSource, getEntityFromId }} />
        </div>
      );
    }
  }
  const selectElementId = `select_source_${source.id}`;
  const chooseSourceMessage = source.type !== null ? null : 'Choose a source';
  const sourceTypeSelector = source.output !== null ? null : (
    <label htmlFor="select_source">
      {chooseSourceMessage}
      <br />
      <select value={source.type} onChange={onChange} id={selectElementId}>
        <option value=" " />
        <option value="file">file</option>
        <option value="restriction">Restriction</option>
        <option value="genbank_id">GenBank ID</option>
        <option value="sticky_ligation">Ligation with sticky ends</option>
      </select>
    </label>
  );
  console.log('rendering');
  const tooltipText = <div className="tooltip-text">Delete source and children</div>;
  const onClickDeleteSource = () => deleteSource(source);
  return (
    <div className="select-source">

      <button className="icon-corner" type="submit" onClick={onClickDeleteSource}>
        <Tooltip title={tooltipText} arrow placement="top">
          <Box>
            <FaTrashAlt />
          </Box>
        </Tooltip>

      </button>
      {sourceTypeSelector}
      {specificSource}
    </div>
  );
}

export default Source;
