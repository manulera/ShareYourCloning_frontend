import React from 'react';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import { formatSequenceForOverhangDisplay } from '../utils/sequenceDisplay';

function OverhangsDisplay({ entity }) {
  if (entity === undefined
    || (entity.sequence.overhang_crick_3prime === 0 && entity.sequence.overhang_watson_3prime === 0)
  ) { return null; }
  const teselaJsonSequence = convertToTeselaJson(entity);
  const { watson, crick, middle } = formatSequenceForOverhangDisplay(
    teselaJsonSequence.sequence,
    entity.sequence.overhang_crick_3prime,
    entity.sequence.overhang_watson_3prime,
  );

  return (
    <div className="overhang-representation">
      <div>{watson}</div>
      <div>{middle}</div>
      <div>{crick}</div>
    </div>
  );
}

export default OverhangsDisplay;
