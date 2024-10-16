import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash-es';
import { formatSequenceForOverhangDisplay } from '../utils/sequenceDisplay';

function OverhangsDisplay({ entity: sequence }) {
  const teselaJsonSequence = useSelector(({ cloning }) => cloning.teselaJsonCache[sequence.id], isEqual);
  if (sequence === undefined
    || (sequence.overhang_crick_3prime === 0 && sequence.overhang_watson_3prime === 0)
  ) { return null; }
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
