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

export const classNameToEndPointMap = {
  UploadedFileSource: 'uploaded_file',
  RepositoryIdSource: 'repository_id',
  GenomeCoordinatesSource: 'genome_coordinates',
  ManuallyTypedSource: 'manually_typed',
  OligoHybridizationSource: 'oligo_hybridization',
  RestrictionEnzymeDigestionSource: 'restriction_enzyme_digestion',
  PCRSource: 'pcr',
  PolymeraseExtensionSource: 'polymerase_extension',
  LigationSource: 'ligation',
  GibsonAssemblySource: 'gibson_assembly',
  HomologousRecombinationSource: 'homologous_recombination',
  CRISPRSource: 'crispr',
  RestrictionAndLigationSource: 'restriction_and_ligation',
};
