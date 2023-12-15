import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { reversePositionInRange } from '@teselagen/range-utils';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import { convertToTeselaJson, parseFeatureLocation } from '../../utils/sequenceParsers';

function SubSequenceDisplayer({
  source, sourceId, overhangs,
}) {
  if (!['PCR', 'restriction'].includes(source.type)) {
    return null;
  }
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const seq = convertToTeselaJson(inputEntities[0]);

  const editorName = `subsequence_editor_${sourceId}`;
  let selectionLayer = null;

  if (['PCR'].includes(source.type)) {
    if (source.assembly[0][1] > 0) {
      selectionLayer = {
        start: parseFeatureLocation(source.assembly[0][3])[0].start,
        end: parseFeatureLocation(source.assembly[1][2])[0].end,
      };
    } else {
      selectionLayer = {
        end: reversePositionInRange(parseFeatureLocation(source.assembly[0][3])[0].start, seq.size),
        start: reversePositionInRange(parseFeatureLocation(source.assembly[1][2])[0].end, seq.size),
      };
    }
  }
  if (['restriction'].includes(source.type)) {
    const [leftWatson, leftCrick] = source.left_edge === null ? [0, 0] : source.left_edge;
    const [rightWatson, RightCrick] = source.right_edge === null ? [seq.size, seq.size] : source.right_edge;

    selectionLayer = {
      start: overhangs[0] > 0 ? leftCrick : leftWatson,
      end: overhangs[1] > 0 ? rightWatson : RightCrick,
    };
  }

  return (
    <div className="multiple-output-selector">
      <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, selectionLayer, caretPosition: null, height: 'auto' }} />
    </div>
  );
}

export default SubSequenceDisplayer;
