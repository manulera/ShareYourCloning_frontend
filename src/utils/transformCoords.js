import { flipContainedRange, isRangeWithinRange, translateRange } from '@teselagen/range-utils';

export default function getTransformCoords({ assembly, type: sourceType }, parentSequenceData, productLength) {
  if (!assembly) {
    return () => null;
  }

  const fragments = sourceType !== 'PCRSource' ? structuredClone(assembly) : [structuredClone(assembly[1])];

  let count = 0;
  if (sourceType === 'PCRSource') {
    count = fragments[0].left_location.start;
  }
  // Special case for insertion assemblies
  // else if (fragments[0].sequence === fragments[fragments.length - 1].sequence && !circular) {
  //   const concernedFragments = fragments.filter((f) => f.id === fragments[0].left.sequence);
  //   concernedFragments[1].left_location = concernedFragments[0].left_location;
  //   concernedFragments[0].left_location = null;
  //   concernedFragments[1].reverse_complemented = concernedFragments[0].reverse_complemented;
  // }
  fragments.forEach((f) => {
    const sequence = parentSequenceData.find((e) => e.id === f.sequence);
    const { size } = sequence;
    const { left_location: left, right_location: right } = f;
    const leftEdge = count;
    const rightStart = right?.start || 0;
    const rightEnd = right?.end || size;
    const rightEdge = count + rightEnd - (left?.start || 0);
    // Ranges are 0-based, but [0:0] is not empty, it's the equivalent to python's [0:1]
    f.rangeInAssembly = translateRange({ start: leftEdge, end: rightEdge - 1 }, 0, productLength);
    f.size = size;

    count += (rightStart - (left?.start || 0));
  });
  const rangeInParent = (selection, id) => {
    if (selection.start === -1) {
      return null;
    }

    // In insertion assemblies, more than one fragment has the same id,
    // so we filter instead of find
    const possibleOut = fragments.filter((f) => f.sequence === id).map((fragment) => {
      const { rangeInAssembly, left_location: left, reverse_complemented, size } = fragment;
      const startInParent = left?.start || 0;
      if (isRangeWithinRange(selection, rangeInAssembly, productLength)) {
        const selectionShifted = selection.start < selection.end ? selection : { start: selection.start, end: selection.end + productLength };
        const outRange = translateRange(selectionShifted, -rangeInAssembly.start + startInParent, size);
        if (reverse_complemented) {
          return flipContainedRange(outRange, { start: 0, end: size - 1 }, size);
        }
        return outRange;
      }
      return null;
    });
    return possibleOut.find((out) => out !== null) || null;
  };
  return rangeInParent;
}
