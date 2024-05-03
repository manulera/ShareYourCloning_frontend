import { addSource, manuallyTypeSequence, clickMultiSelectOption, loadHistory, deleteSource, clickSequenceOutputArrow, setInputValue, addPrimer, clearPrimers, addLane } from './common_functions';

describe('Makes all examples', () => {
  beforeEach(() => {
    cy.visit('/');
    clearPrimers();
  });
  it('Homologous recombination', () => {
    // Load addgene plasmid
    addSource('RepositoryIdSource', true);
    clickMultiSelectOption('Select repository', 'AddGene', 'li#source-1');
    setInputValue('ID in repository', '19342', 'li#source-1');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('li#sequence-2', { timeout: 20000 }).should('exist');
    // Do a pcr on it
    addPrimer('fwd', 'AGTTTTCATATCTTCCTTTATATTCTATTAATTGAATTTCAAACATCGTTTTATTGAGCTCATTTACATCAACCGGTTCACGGATCCCCGGGTTAATTAA');
    addPrimer('rvs', 'CTTTTATGAATTATCTATATGCTGTATTCATATGCAAAAATATGTATATTTAAATTTGATCGATTAGGTAAATAAGAAGCGAATTCGAGCTCGTTTAAAC');
    addSource('PCRSource');
    clickMultiSelectOption('Forward primer', 'fwd', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'rvs', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });
    // Load Ase1 sequence with some extra sequences on the sides
    addLane();
    addSource('GenomeCoordinatesSource', true);
    clickMultiSelectOption('Type of region', 'Locus in reference genome', 'li#source-5');
    cy.get('li#source-5 label', { timeout: 20000 }).contains('Species');
    setInputValue('Species', 'pombe', 'li#source-5');
    cy.get('#tags-standard-option-0', { timeout: 20000 }).click();
    setInputValue('Gene', 'ase1', 'li#source-5');
    cy.get('#tags-standard-option-0', { timeout: 20000 }).click();
    // Next is submit
  });
});
