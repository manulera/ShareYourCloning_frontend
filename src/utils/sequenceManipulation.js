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

export function simulateHomologousRecombination(templateEntity, targetEntity, rois, invertFragment) {
  const [amplifyRange, insertionRange] = rois;

  const templateSequence = convertToTeselaJson(templateEntity);
  let templateFragment = getSequenceDataBetweenRange(templateSequence, amplifyRange);
  if (invertFragment) {
    templateFragment = getReverseComplementSequenceAndAnnotations(templateFragment);
  }

  const targetSequence = convertToTeselaJson(targetEntity);
  return insertSequenceDataAtPositionOrRange(templateFragment, targetSequence, insertionRange);
}
