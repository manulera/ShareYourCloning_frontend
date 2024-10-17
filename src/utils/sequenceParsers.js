import { genbankToJson } from '@teselagen/bio-parsers';
import { tidyUpSequenceData } from '@teselagen/sequence-utils';

export function convertToTeselaJson(sequence) {
  // TODO: This might have been fixed in more recent versions of the library
  // For some reason, as it is it does not read circular or linear properly from certain files
  const { parsedSequence } = genbankToJson(sequence.file_content)[0];

  if (sequence.file_content.split('\n')[0].includes('linear')) {
    parsedSequence.circular = false;
  }
  parsedSequence.id = sequence.id;
  return tidyUpSequenceData(parsedSequence);
}
