import { genbankToJson } from '@teselagen/bio-parsers';

export function convertToTeselaJson(sequence) {
  // TODO: This might have been fixed in more recent versions of the library
  // For some reason, as it is it does not read circular or linear properly from certain files
  const { parsedSequence } = genbankToJson(sequence.file_content)[0];

  if (sequence.file_content.split('\n')[0].includes('linear')) {
    parsedSequence.circular = false;
  }
  return parsedSequence;
}

// This is copied from the Teselagen codebase, since the function is not exported.

export function parseFeatureLocation(
  locStr,
  isProtein,
  inclusive1BasedStart,
  inclusive1BasedEnd,
  isCircular,
  sequenceLength,
) {
  locStr = locStr.trim();
  const locArr = [];
  locStr.replace(/(\d+)/g, (string, match) => {
    locArr.push(match);
  });
  const locArray = [];
  for (let i = 0; i < locArr.length; i += 2) {
    const start = parseInt(locArr[i], 10) - (inclusive1BasedStart ? 0 : 1);
    let end = parseInt(locArr[i + 1], 10) - (inclusive1BasedEnd ? 0 : 1);
    if (Number.isNaN(end)) {
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
    locArray.push(location);
  }
  // In genbank files, origin-spanning features are represented as follows:
  // complement(join(490883..490885,1..879)) (for a circular sequence of length 490885)
  // Then, for locations in locArray we check if there is a feature that ends at sequenceLength
  // joined with a feature that starts at 1. If so, we merge them into a single feature.
  // (see https://github.com/TeselaGen/tg-oss/issues/35)

  if (isCircular) {
    // Iterate by pairs of features
    for (let i = 0; i < locArray.length; i += 2) {
      const firstFeature = locArray[i];
      const secondFeature = locArray[i + 1];
      if (
        firstFeature.end === sequenceLength - (inclusive1BasedEnd ? 0 : 1)
        && secondFeature.start === 1 - (inclusive1BasedStart ? 0 : 1)
      ) {
        // Merge the two features
        locArray[i] = {
          start: firstFeature.start,
          end: secondFeature.end,
        };
        locArray.splice(i + 1, 1);
      }
    }
  }
  return locArray;
}
