import React from 'react';
import { convertToTeselaJson } from '../utils/sequenceParsers';
import { formatSequenceForOverhangDisplay } from '../utils/sequenceDisplay';

function OverhangsDisplay({ entity: sequence }) {
  if (sequence === undefined
    || (sequence.overhang_crick_3prime === 0 && sequence.overhang_watson_3prime === 0)
  ) { return null; }
  const teselaJsonSequence = convertToTeselaJson(sequence);
  const { watson, crick, middle } = formatSequenceForOverhangDisplay(
    teselaJsonSequence.sequence,
    sequence.overhang_crick_3prime,
    sequence.overhang_watson_3prime,
  );

  return (
    <div className="overhang-representation">
      {watson}
      <br />
      {middle}
      <br />
      {crick}
    </div>
  );
}

export default OverhangsDisplay;
