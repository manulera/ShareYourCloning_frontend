import { flipContainedRange, isRangeWithinRange, translateRange } from '@teselagen/range-utils';
import { convertToTeselaJson } from './sequenceParsers';

export default function getTransformCoords({ assembly, input, type: sourceType, circular }, inputEntities, productLength) {
  if (!assembly) {
    return () => null;
  }

  let fragments;
  if (sourceType !== 'PCRSource') {
  // We take all left fragments
    fragments = assembly.map(({ left }) => ({ id: left.sequence, left: null, right: null, reverseComplemented: null }));

    // We add the last right fragment if the assembly is linear
    // TODO: This will give an error for insertion assemblies
    if (!circular) {
      fragments.push({ id: assembly[assembly.length - 1].right.sequence, left: null, right: null, reverseComplemented: null });
    }
    assembly.forEach(({ left, right }) => {
      const leftId = left.sequence;
      const rightId = right.sequence;
      if (leftId) {
        const leftFragment = fragments.find((f) => f.id === leftId);
        leftFragment.right = { start: left.location.start, end: left.location.end };
        leftFragment.reverseComplemented = left.reverse_complemented;
      }
      if (rightId) {
        const rightFragment = fragments.find((f) => f.id === rightId);
        rightFragment.left = { start: right.location.start, end: right.location.end };
        rightFragment.reverseComplemented = right.reverse_complemented;
      }
    });
  } else {
    const left = {
      start: assembly[0].right.location.start,
      end: assembly[0].right.location.end,
    };
    const right = {
      start: assembly[1].left.location.start,
      end: assembly[1].left.location.end,
    };
    fragments = [{ id: input[0], left, right, reverseComplemented: false }];
  }
  let count = 0;
  if (sourceType === 'PCRSource') {
    count = assembly[0].left.location.start;
  }
  // Special case for insertion assemblies
  else if (assembly[0].left.sequence === assembly[assembly.length - 1].right.sequence && !circular) {
    const concernedFragments = fragments.filter((f) => f.id === assembly[0].left.sequence);
    concernedFragments[1].left = concernedFragments[0].left;
    concernedFragments[0].left = null;
    concernedFragments[1].reverseComplemented = concernedFragments[0].reverseComplemented;
  }
  fragments.forEach((f) => {
    const entity = inputEntities.find((e) => e.id === f.id);
    const sequence = convertToTeselaJson(entity);
    const { size } = sequence;
    const { left, right } = f;
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
    const possibleOut = fragments.filter((f) => f.id === id).map((fragment) => {
      const { rangeInAssembly, left, reverseComplemented, size } = fragment;
      const startInParent = left?.start || 0;
      if (isRangeWithinRange(selection, rangeInAssembly, productLength)) {
        const outRange = translateRange(selection, -rangeInAssembly.start + startInParent, size);
        if (reverseComplemented) {
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
