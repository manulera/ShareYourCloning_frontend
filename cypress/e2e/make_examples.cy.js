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
    cy.get('li#source-5').contains('Submit').click();
    cy.get('li#sequence-6', { timeout: 20000 }).should('exist');
    // Do a homologous recombination
    addSource('HomologousRecombinationSource');
    clickMultiSelectOption('Template sequence', '6', 'li#source-7');
    clickMultiSelectOption('Insert sequence', '4', 'li#source-7');
    cy.get('li#source-7 button.submit-backend-api').click();
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').click();
    cy.get('[role="menuitem"]').contains('Save to file').click();
  });
  it('Restriction-ligation single step', () => {
    // Load Ase1 sequence with some extra sequences on the sides
    addSource('GenomeCoordinatesSource', true);
    clickMultiSelectOption('Type of region', 'Locus in reference genome', 'li#source-1');
    cy.get('li#source-1 label', { timeout: 20000 }).contains('Species');
    setInputValue('Species', 'pombe', 'li#source-1');
    cy.get('#tags-standard-option-0', { timeout: 20000 }).click();
    setInputValue('Gene', 'ase1', 'li#source-1');
    cy.get('#tags-standard-option-0', { timeout: 20000 }).click();
    cy.get('li#source-1').contains('Submit').click();
    cy.get('li#sequence-2', { timeout: 20000 }).should('exist');
    // Do a pcr on it
    addPrimer('fwd', 'TAAGCAGTCGACatgcaaacagtaatgatggatg');
    addPrimer('rvs', 'TAAGCAGGCGCGCCttaaaagccttcttctccccatt');
    addSource('PCRSource');
    clickMultiSelectOption('Forward primer', 'fwd', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'rvs', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });
    cy.get('li#sequence-4', { timeout: 20000 }).should('exist');

    // Load addgene plasmid
    addLane();
    addSource('RepositoryIdSource', true);
    clickMultiSelectOption('Select repository', 'AddGene', 'li#source-5');
    setInputValue('ID in repository', '39296', 'li#source-5');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('li#sequence-6', { timeout: 20000 }).should('exist');

    // Do a restriction-ligation
    addSource('RestrictionAndLigationSource');
    clickMultiSelectOption('Input sequences', 'Select all', 'li#source-7');
    clickMultiSelectOption('Enzymes used', 'AscI', 'li#source-7');
    clickMultiSelectOption('Enzymes used', 'SalI', 'li#source-7');
    cy.get('li#source-7 button.submit-backend-api').click();
    cy.get('li#source-7').contains('Choose fragment', { timeout: 20000 }).click();
    cy.get('li#sequence-8', { timeout: 20000 }).contains('ase1').should('exist');
    cy.get('li#sequence-8').contains('kanMX').should('exist');
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').click();
    cy.get('[role="menuitem"]').contains('Save to file').click();
  });
});
