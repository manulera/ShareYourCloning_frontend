import { genbankToJson, ab1ToJson } from '@teselagen/bio-parsers';
import { tidyUpSequenceData } from '@teselagen/sequence-utils';
import { base64ToBlob } from './readNwrite';

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

export async function getJsonFromAb1Base64(ab1Base64, fileName = null) {
  try {
    const blob = base64ToBlob(ab1Base64);
    const results = await ab1ToJson(blob);
    return results[0].parsedSequence;
  } catch (error) {
    const fileNameError = fileName || 'ab1 file';
    throw new Error(`Error parsing ${fileNameError}: ${error.message}`);
  }
}
