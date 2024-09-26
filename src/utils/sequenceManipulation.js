import { getReverseComplementSequenceAndAnnotations, getSequenceDataBetweenRange, insertSequenceDataAtPositionOrRange } from '@teselagen/sequence-utils';
import { fastaToJson } from '@teselagen/bio-parsers';
import { convertToTeselaJson } from './sequenceParsers';

function getSpacerSequence(spacer) {
  if (!spacer) {
    return null;
  }
  const spacerSequence = fastaToJson(spacer)[0].parsedSequence;
  // Add a feature spanning the length of the spacer
  spacerSequence.features = [{
    start: 0,
    end: spacer.length - 1,
    type: 'misc_feature',
    name: 'spacer',
    strand: 1,
    forward: true,
  }];
  return spacerSequence;
}

export function joinEntitiesIntoSingleSequence(entities, locations, orientations, spacers, circularAssembly) {
  const sequences = entities.map(convertToTeselaJson);
  // Turn the spacers into sequences by parsing them as FASTA with fastaToJson
  const spacerSequences = spacers.map(getSpacerSequence);

  // Intercalate the spacers into the sequences
  const sequences2join = [];
  const locations2join = [];
  const orientations2join = [];

  if (!circularAssembly && spacerSequences[0]) {
    sequences2join.push(spacerSequences.shift());
    locations2join.push({ start: 0, end: sequences2join[0].sequence.length - 1 });
    orientations2join.push('forward');
  }

  for (let i = 0; i < sequences.length; i++) {
    sequences2join.push(sequences[i]);
    locations2join.push(locations[i]);
    orientations2join.push(orientations[i]);
    if (spacerSequences[i]) {
      sequences2join.push(spacerSequences[i]);
      locations2join.push({ start: 0, end: spacerSequences[i].sequence.length - 1 });
      orientations2join.push('forward');
    }
  }

  const fragments = sequences2join.map((sequence, index) => {
    const seq = getSequenceDataBetweenRange(sequence, locations2join[index]);
    if (orientations2join[index] === 'reverse') {
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
