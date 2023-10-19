import React from 'react';
import { getReverseComplementSequenceString } from '@teselagen/sequence-utils';
import { convertToTeselaJson } from '../sequenceParsers';

function formatSequenceForOverhangDisplay(
  sequenceString, overhangCrick3prime, overhangWatson3prime,
) {
  let watson = sequenceString;
  let crick = getReverseComplementSequenceString(sequenceString);
  // If necessary, we trim the left side
  if (overhangCrick3prime < 0) {
    crick = crick.substring(0, crick.length + overhangCrick3prime) + ' '.repeat(-overhangCrick3prime);
  } else if (overhangCrick3prime > 0) {
    watson = ' '.repeat(overhangCrick3prime) + watson.substring(overhangCrick3prime, watson.length);
  }
  if (overhangWatson3prime < 0) {
    watson = watson.substring(0, watson.length + overhangWatson3prime) + ' '.repeat(-overhangWatson3prime);
  } else if (overhangWatson3prime > 0) {
    crick = ' '.repeat(overhangWatson3prime) + crick.substring(overhangWatson3prime, crick.length);
  }
  // Invert the crick strand
  crick = crick.split('').reverse().join('');
  let middle = '';
  for (let i = 0; i < watson.length; i += 1) {
    middle += watson[i] !== ' ' && crick[i] !== ' ' ? '|' : ' ';
  }
  // We want to show up to 10 bp inside the body of the molecule
  const lengthLimit = 10 + Math.abs(overhangCrick3prime) + Math.abs(overhangWatson3prime);
  const trimRepresentation = (rep, edge, dummyRepeatNumber) => {
    const edgeLeft = rep.substring(0, Math.abs(overhangCrick3prime) + edge);
    const edgeRight = rep.substring(rep.length - Math.abs(overhangWatson3prime) - edge, rep.legth);
    const middleSection = '...';
    return edgeLeft + middleSection + edgeRight;
  };

  if (watson.length >= lengthLimit) {
    watson = trimRepresentation(watson, 5, 5).toUpperCase();
    crick = trimRepresentation(crick, 5, 5).toUpperCase();
    middle = trimRepresentation(middle, 5, 5).toUpperCase();
  }
  return { watson, crick, middle };
}

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
