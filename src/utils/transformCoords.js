import { flipContainedRange, isRangeWithinRange, translateRange } from '@teselagen/range-utils';
import { convertToTeselaJson } from './sequenceParsers';

export default function getTransformCoords({ assembly, input, type: sourceType, circular }, inputEntities, productLength) {
  if (!assembly) {
    return () => null;
  }

  let fragments;
  if (sourceType !== 'PCRSource') {
  // We take all left fragments
    fragments = assembly.map(({ left }) => {
      const leftId = input[Math.abs(left.sequence) - 1];
      return { id: leftId, left: null, right: null, reverseComplemented: null };
    });

    // We add the last right fragment if the assembly is linear
    // TODO: This will give an error for insertion assemblies
    if (!circular) {
      const lastId = input[Math.abs(assembly[assembly.length - 1].right.sequence) - 1];
      fragments.push({ id: lastId, left: null, right: null, reverseComplemented: null });
    }
    assembly.forEach(({ left, right }) => {
      const leftId = input[Math.abs(left.sequence) - 1];
      const rightId = input[Math.abs(right.sequence) - 1];
      if (leftId) {
        const leftFragment = fragments.find((f) => f.id === leftId);
        // Skipped in primers
        if (leftFragment) {
          leftFragment.right = { start: left.location.start, end: left.location.end };
          leftFragment.reverseComplemented = left.reverse_complemented;
        }
      }
      if (rightId) {
        const rightFragment = fragments.find((f) => f.id === rightId);
        // Skipped in primers
        if (rightFragment) {
          rightFragment.left = { start: right.location.start, end: right.location.end };
          rightFragment.reverseComplemented = right.reverse_complemented;
        }
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
  console.log(fragments[0].left, fragments[0].right, fragments[0].rangeInAssembly);
  const rangeInParent = (selection, id) => {
    if (selection.start === -1) {
      return null;
    }
    const fragment = fragments.find((f) => f.id === id);
    const { rangeInAssembly, left: { start: startInParent }, reverseComplemented, size } = fragment;
    if (isRangeWithinRange(selection, rangeInAssembly, productLength)) {
      const outRange = translateRange(selection, -rangeInAssembly.start + startInParent, productLength);
      if (reverseComplemented) {
        return flipContainedRange(outRange, { start: 0, end: size - 1 }, size);
      }
      return outRange;
    }
    return null;
  };
  return rangeInParent;
}
