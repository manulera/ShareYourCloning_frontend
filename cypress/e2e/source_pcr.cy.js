import { addPrimer, addSource, manuallyTypeSequence, clickMultiSelectOption, setInputValue } from './common_functions';

describe('Tests PCR functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('works in the normal case', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('ACGTACGT', 'fwd_test');
    addPrimer('GCGCGCGC', 'rvs_test');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    manuallyTypeSequence('TTTTACGTACGTAAAAAAGCGCGCGCTTTTT');
    addSource('PCR');

    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'rvs_test', 'li#source-3');

    // Change minimal annealing
    setInputValue('Minimal annealing', '8', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    // The result is shown
    cy.get('li#sequence-4 li#source-3', { timeout: 20000 }).should('exist');
    cy.get('li#sequence-4').contains('22 bps');
  });
  it('can use the same primer twice', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('ACGTACGT', 'fwd_test');
    addPrimer('GCGCGCGC', 'rvs_test');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    manuallyTypeSequence('TTTTACGTACGTAAAAAAACGTACGTTTTTT');
    addSource('PCR');
    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'fwd_test', 'li#source-3');
    // Change minimal annealing
    setInputValue('Minimal annealing', '8', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    // The result is shown
    cy.get('li#sequence-4 li#source-3', { timeout: 20000 }).should('exist');
    cy.get('li#sequence-4').contains('22 bps');
  });
  it('gives the right error for minimal annealing', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('ACGTACGT', 'fwd_test');
    addPrimer('GCGCGCGC', 'rvs_test');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    manuallyTypeSequence('TTTTACGTACGTAAAAAAGCGCGCGCTTTTT');
    addSource('PCR');

    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'rvs_test', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    cy.get('.MuiAlert-message').contains('No pair of annealing primers was found.');
  });
  it('gives the right error for no annealing', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('CCCCCCCC', 'fwd_test');
    addPrimer('CCCCCCCC', 'rvs_test');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    manuallyTypeSequence('TTTTACGTACGTAAAAAAGCGCGCGCTTTTT');
    addSource('PCR');

    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'rvs_test', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    cy.get('.MuiAlert-message').contains('No pair of annealing primers was found.');
  });
  it('shows the submission button only after the primers are selected', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('ACGTACGT', 'fwd_test');
    addPrimer('GCGCGCGC', 'rvs_test');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    manuallyTypeSequence('TTTTACGTACGTAAAAAAGCGCGCGCTTTTT');
    addSource('PCR');
    // Submission not available until primers are both selected
    cy.get('button').contains('Perform PCR').should('not.exist');
    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-3');
    cy.get('button').contains('Perform PCR').should('not.exist');
    clickMultiSelectOption('Reverse primer', 'rvs_test', 'li#source-3');
    cy.get('button').contains('Perform PCR').should('exist');
  });

  it('works with mismatches', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('ACGAACGT', 'fwd_test');
    addPrimer('GCGAGCGC', 'rvs_test');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    manuallyTypeSequence('TTTTACGTACGTAAAAAAGCGCGCGCTTTTT');
    addSource('PCR');

    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-3');
    clickMultiSelectOption('Reverse primer', 'rvs_test', 'li#source-3');

    // Change minimal annealing
    setInputValue('Minimal annealing', '8', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();

    // Error, because mismatches are not set
    cy.get('.MuiAlert-message');

    // Set the mismatches
    setInputValue('Mismatches allowed', '1', 'li#source-3');
    cy.get('button').contains('Perform PCR').click();
    // The result is shown
    cy.get('li#sequence-4 li#source-3', { timeout: 20000 }).should('exist');
    cy.get('li#sequence-4').contains('22 bps');
  });
});
