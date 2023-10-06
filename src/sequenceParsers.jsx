import { genbankToJson } from '@teselagen/bio-parsers';

export function convertToTeselaJson(entity) {
  // TODO: This might have been fixed in more recent versions of the library
  // For some reason, as it is it does not read circular or linear properly from certain files
  const { parsedSequence } = genbankToJson(entity.sequence.file_content)[0];

  if (entity.sequence.file_content.split('\n')[0].includes('linear')) {
    parsedSequence.circular = false;
  }
  return parsedSequence;
}
