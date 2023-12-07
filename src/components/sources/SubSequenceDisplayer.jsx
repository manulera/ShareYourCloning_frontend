import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import { convertToTeselaJson } from '../../utils/sequenceParsers';

function SubSequenceDisplayer({
  sources, selectedOutput, sourceId,
}) {
  if (sources.length === 0) { return null; }
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const source = sources[selectedOutput];

  const editorName = `subsequence_editor_${sourceId}`;
  if (['restriction', 'PCR'].includes(source.type)) {
    const seq = convertToTeselaJson(inputEntities[0]);
    const selectionLayer = { start: source.fragment_boundaries[0], end: source.fragment_boundaries[1] };

    return (
      <div className="multiple-output-selector">
        <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, selectionLayer, caretPosition: source.fragment_boundaries[0], height: 'auto' }} />
      </div>
    );
  }
  return null;
}

export default SubSequenceDisplayer;
