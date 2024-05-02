export function enzymesInRestrictionEnzymeDigestionSource(source) {
/**
 * Extracts the enzymes used in a RestrictionEnzymeDigestionSource as an array of strings.
 */
  if (source.type !== 'RestrictionEnzymeDigestionSource') {
    throw new Error('This function only works on RestrictionEnzymeDigestionSource');
  }

  const output = [];
  if (source.left_edge) { output.push(source.left_edge.restriction_enzyme); }
  // add the second one only if it's different
  if (source.right_edge && (!source.left_edge || source.right_edge.restriction_enzyme !== source.left_edge.restriction_enzyme)) {
    output.push(source.right_edge.restriction_enzyme);
  }

  return output;
}
