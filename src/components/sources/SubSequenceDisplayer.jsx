import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import { convertToTeselaJson } from '../../utils/sequenceParsers';

function SubSequenceDisplayer({
  source, sourceId, overhangs,
}) {
  console.log(source);
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);

  const editorName = `subsequence_editor_${sourceId}`;
  if (['PCR'].includes(source.type)) {
    const seq = convertToTeselaJson(inputEntities[0]);
    const selectionLayer = { start: source.fragment_boundaries[0], end: source.fragment_boundaries[1] };

    return (
      <div className="multiple-output-selector">
        <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, selectionLayer, caretPosition: source.fragment_boundaries[0], height: 'auto' }} />
      </div>
    );
  }
  if (['restriction'].includes(source.type)) {
    const seq = convertToTeselaJson(inputEntities[0]);
    const [leftWatson, leftCrick] = source.left_edge === null ? [0, 0] : source.left_edge;
    const [rightWatson, RightCrick] = source.right_edge === null ? [seq.size, seq.size] : source.right_edge;

    const start = overhangs[0] > 0 ? leftCrick : leftWatson;
    const end = overhangs[1] > 0 ? rightWatson : RightCrick;

    const selectionLayer = { start, end };

    return (
      <div className="multiple-output-selector">
        <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, selectionLayer, caretPosition: start, height: 'auto' }} />
      </div>
    );
  }
  return null;
}

export default SubSequenceDisplayer;
