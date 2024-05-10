import React from 'react';
import { SimpleCircularOrLinearView } from '@teselagen/ove';
import { shallowEqual, useSelector } from 'react-redux';
import { reversePositionInRange } from '@teselagen/range-utils';
import { parseFeatureLocation } from '@teselagen/bio-parsers';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import { convertToTeselaJson } from '../../utils/sequenceParsers';

function getCutParameters(seq, cut, isLeft) {
  if (cut === null) {
    return isLeft ? [0, 0, 0] : [seq.size, seq.size, 0];
  }
  const { cut_watson: watson, overhang: ovhg } = cut;
  const crick = (watson - ovhg) % seq.size;
  return [watson, crick, ovhg];
}

function SubSequenceDisplayer({
  source, sourceId,
}) {
  if (!['PCRSource', 'RestrictionEnzymeDigestionSource'].includes(source.type)) {
    return null;
  }
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const seq = convertToTeselaJson(inputEntities[0]);

  const editorName = `subsequence_editor_${sourceId}`;
  let selectionLayer = null;

  if (['PCRSource'].includes(source.type)) {
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
  if (['RestrictionEnzymeDigestionSource'].includes(source.type)) {
    // The edges have the form (watson_pos, ovhg)

    const [leftWatson, leftCrick, leftOvhg] = getCutParameters(seq, source.left_edge, true);
    const [rightWatson, rightCrick, RightOvhg] = getCutParameters(seq, source.right_edge, false);

    selectionLayer = {
      start: leftOvhg > 0 ? leftCrick : leftWatson,
      end: RightOvhg > 0 ? rightWatson : rightCrick,
    };
  }

  return (
    <div className="multiple-output-selector">
      <SimpleCircularOrLinearView {...{ sequenceData: seq, editorName, selectionLayer, caretPosition: null, height: 'auto' }} />
    </div>
  );
}

export default SubSequenceDisplayer;
