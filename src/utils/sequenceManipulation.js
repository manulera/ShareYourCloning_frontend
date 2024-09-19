import { getReverseComplementSequenceAndAnnotations, getSequenceDataBetweenRange, insertSequenceDataAtPositionOrRange } from '@teselagen/sequence-utils';
import { convertToTeselaJson } from './sequenceParsers';

export function joinEntitiesIntoSingleSequence(entities, locations, orientations) {
  const sequences = entities.map(convertToTeselaJson);
  const fragments = sequences.map((sequence, index) => {
    const seq = getSequenceDataBetweenRange(sequence, locations[index]);
    if (orientations[index] === 'reverse') {
      return getReverseComplementSequenceAndAnnotations(seq);
    }
    return seq;
  });
  // Concatenate all fragments
  let outputSequence = fragments[0];
  for (let i = 1; i < fragments.length; i++) {
    outputSequence = insertSequenceDataAtPositionOrRange(fragments[i], outputSequence, outputSequence.sequence.length);
  }
  return outputSequence;
}
