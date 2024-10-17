import React from 'react';
import { formatSequenceForOverhangDisplay } from '../utils/sequenceDisplay';

function OverhangsDisplay({ entity, sequenceData }) {
  if (entity === undefined
    || (sequenceData.overhang_crick_3prime === 0 && sequenceData.overhang_watson_3prime === 0)
  ) { return null; }
  const { watson, crick, middle } = formatSequenceForOverhangDisplay(
    sequenceData.sequence,
    entity.overhang_crick_3prime,
    entity.overhang_watson_3prime,
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
