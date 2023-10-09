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

export function parseFeatureLocation(locStr, options) {
  locStr = locStr.trim();
  const locArr = [];
  locStr.replace(/(\d+)/g, (string, match) => {
    locArr.push(match);
  });
  for (let i = 0; i < locArr.length; i += 2) {
    const start = parseInt(locArr[i], 10) - (inclusive1BasedStart ? 0 : 1);
    let end = parseInt(locArr[i + 1], 10) - (inclusive1BasedEnd ? 0 : 1);
    if (isNaN(end)) {
      // if no end is supplied, assume that the end should be set to whatever the start is
      // this makes a feature location passed as:
      // 147
      // function like:
      // 147..147
      end = start;
    }
    const location = {
      start,
      end,
    };
    const feat = getCurrentFeature();
    feat.locations.push(
      options.isProtein
        ? convertAACaretPositionOrRangeToDna(location)
        : location,
    );
  }
}
