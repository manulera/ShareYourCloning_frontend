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

// This is copied from the Teselagen codebase, since the function is not exported.

export function parseFeatureLocation(locStr) {
  // For now a very simple version that extracts the start and end positions

  const locArr = [];
  locStr.replace(/(\d+)/g, (string, match) => {
    locArr.push(match);
  });

  if (locStr.includes('complement')) {
    return { start: locArr[1], end: locArr[0] };
  }
  return { start: locArr[0], end: locArr[1] };
}
