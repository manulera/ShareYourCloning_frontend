import { convertToTeselaJson } from './sequenceParsers';

// This should actually return a function to transform the coordinates,
// so that you only call it once when the source component mounts.
export function transformCoordinates({ assembly, input }, entities) {
  const fragments = input.map((id) => ({ id, left: null, right: null, reverse_complemented: null }));

  assembly.forEach(({ left, right }) => {
    const leftId = input[Math.abs(left.sequence) - 1];
    const rightId = input[Math.abs(right.sequence) - 1];

    fragments.find((f) => f.id === leftId).right = { start: left.location.start, end: left.location.end, reverse_complemented: left.reverse_complemented };
    fragments.find((f) => f.id === rightId).left = { start: right.location.start, end: right.location.end, reverse_complemented: right.reverse_complemented };
  });

  let count = 0;
  fragments.forEach((f) => {
    const entity = entities.find((e) => e.id === f.id);
    const sequence = convertToTeselaJson(entity);
    const { size } = sequence;
    // TODO: reverse complemented
    const { left, right, reverse_complemented } = f;
    const leftEdge = count;
    // TODO adapt to circular
    let rightStart = right.start;
    let rightEnd = right.end;
    if (right.start < left.start) {
      rightStart += size;
      rightEnd += size;
    }
    const rightEdge = count + rightEnd - left.start;
    f.coordsInMain = [leftEdge, rightEdge];
    count += rightStart - left.start;
  });

  function posInParent(pos, fragment) {
    const { coordsInMain, left: { start: startInParent } } = fragment;
    const [startMain, endMain] = coordsInMain;
    // TODO: use library function here
    if (!(pos >= startMain && pos <= endMain)) {
      return null;
    }

    return pos - startMain + startInParent;
  }

  const pos = posInParent(
    2300,
    fragments.find((f) => f.id === 8),
  );
}
