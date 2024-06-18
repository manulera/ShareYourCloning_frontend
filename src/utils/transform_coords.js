const input = [8, 6];
const circular = true;
const assembly = [
  {
    left: {
      sequence: 1,
      location: {
        start: 2257,
        end: 2261,
        strand: null,
      },
      reverse_complemented: false,
    },
    right: {
      sequence: 2,
      location: {
        start: 2355,
        end: 2359,
        strand: null,
      },
      reverse_complemented: false,
    },
  },
  {
    left: {
      sequence: 2,
      location: {
        start: 2329,
        end: 2333,
        strand: null,
      },
      reverse_complemented: false,
    },
    right: {
      sequence: 1,
      location: {
        start: 7,
        end: 11,
        strand: null,
      },
      reverse_complemented: false,
    },
  },
];

const fragments = input.map((id) => ({ id, left: null, right: null, reverse_complemented: null }));

assembly.forEach(({ left, right }) => {
  const leftId = input[Math.abs(left.sequence) - 1];
  const rightId = input[Math.abs(right.sequence) - 1];

  fragments.find((f) => f.id === leftId).right = { start: left.location.start, end: left.location.end, reverse_complemented: left.reverse_complemented };
  fragments.find((f) => f.id === rightId).left = { start: right.location.start, end: right.location.end, reverse_complemented: right.reverse_complemented };
});

fragments.forEach((f) => {
  if (f.id === 8) {
    f.seqLen = 2269;
  }
  if (f.id === 6) {
    f.seqLen = 3938;
  }
});

let count = 0;
fragments.forEach((f) => {
  // TODO: reverse complemented
  const { id, left, right, reverse_complemented, seqLen } = f;
  const leftEdge = count;
  // TODO adapt to circular
  let rightStart = right.start;
  let rightEnd = right.end;
  if (right.start < left.start) {
    rightStart += seqLen;
    rightEnd += seqLen;
  }
  const rightEdge = count + rightEnd - left.start;
  f.coordsInMain = [leftEdge, rightEdge];
  count += rightStart - left.start;
});
console.log(assembly.map((a) => [a.left.sequence, a.left.location, a.right.sequence, a.right.location]));
console.log(fragments);

function posInParent(pos, fragment) {
  const { coordsInMain, seqLen, left: { start: startInParent } } = fragment;
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

console.log(pos);
