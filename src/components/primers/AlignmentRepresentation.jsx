import React from 'react';
import { expandOrContractRangeByLength, getSequenceWithinRange, translateRange } from '@teselagen/range-utils';
import { getReverseComplementSequenceString } from '@teselagen/sequence-utils';
import { getStructuredBases } from '../../utils/getStructuredBases';

function AlignmentRepresentation({ /* fullSequence, primerSequence, position */ }) {
  const fullSequence = 'acgtacgtaaaa';
  const primerSequence = 'acgtac';
  const circular = false;
  const position = { start: 6, end: 6, strand: 1 };
  const position2 = expandOrContractRangeByLength(position, primerSequence.length, true, fullSequence.length);
  const { allBasesWithMetaData } = fullSequence && getStructuredBases({
    annotationRange: position2,
    forward: position2.strand === 1,
    bases: primerSequence,
    start: position2.start - 1,
    end: position2.end - 1,
    fullSequence,
    primerBindsOn: '3prime',
    sequenceLength: fullSequence.length,
  });

  let sequenceRange = expandOrContractRangeByLength(position2, 0, true, fullSequence.length);
  sequenceRange = translateRange(sequenceRange, -1, fullSequence.length);
  if (!circular && sequenceRange.start > sequenceRange.end) {
    sequenceRange.start = 0;
  }
  const mainSeq = getSequenceWithinRange(sequenceRange, fullSequence);
  const mainSeqRc = getReverseComplementSequenceString(mainSeq);
  return (
    <div style={{ fontFamily: 'monospace', width: '300px', margin: 'auto' }}>
      <div style={{ textAlign: 'right' }}>
        {allBasesWithMetaData.map(({ b, isMatch }) => (
          <span style={{ color: isMatch ? 'black' : 'red' }}>
            {b.toUpperCase()}
          </span>
        ))}
      </div>
      <div style={{ textAlign: 'right', color: 'gray' }}>
        {mainSeq.toUpperCase()}
      </div>
      <div style={{ textAlign: 'right', color: 'gray' }}>
        {'|'.repeat(mainSeq.length)}
      </div>
      <div style={{ textAlign: 'right', color: 'gray' }}>
        {mainSeqRc.toUpperCase()}
      </div>

    </div>
  );
}

export default AlignmentRepresentation;
