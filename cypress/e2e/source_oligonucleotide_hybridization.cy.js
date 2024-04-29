import { addPrimer, addSource, manuallyTypeSequence, clickMultiSelectOption, setInputValue } from './common_functions';

describe('Tests PCR functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it.skip('works in the normal case', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('aaGCGGCCGCgtagaactttatgtgcttccttacattggt', 'fwd-hyb');
    addPrimer('aaGCGGCCGCaccaatgtaaggaagcacataaagttctac', 'rvs-hyb');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    addSource('oligonucleotide_hybridization', true);
    // Select the primers
    clickMultiSelectOption('Forward primer', 'fwd-hyb', 'li#source-1');
    clickMultiSelectOption('Reverse primer', 'rvs-hyb', 'li#source-1');
    // Submit
    cy.get('button').contains('Perform hybridization').click();
    // The result is shown
    cy.get('li#sequence-2', { timeout: 20000 }).contains('50 bps');
    cy.get('li#sequence-2 li#source-1').contains('Hybridization of primers fwd-hyb and rvs-hyb');
  });
  it.skip('shows the submission button only after the primers are selected', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('aaGCGGCCGCgtagaactttatgtgcttccttacattggt', 'fwd-hyb');
    addPrimer('aaGCGGCCGCaccaatgtaaggaagcacataaagttctac', 'rvs-hyb');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    addSource('oligonucleotide_hybridization', true);
    cy.get('button').contains('Perform hybridization').should('not.exist');
    // Select the primers
    clickMultiSelectOption('Forward primer', 'fwd-hyb', 'li#source-1');
    cy.get('button').contains('Perform hybridization').should('not.exist');
    clickMultiSelectOption('Reverse primer', 'rvs-hyb', 'li#source-1');
    cy.get('button').contains('Perform hybridization').should('exist');
  });
  it('gives the right error for no annealing', () => {
    cy.get('button.MuiTab-root').contains('Primers').click();
    addPrimer('CCCCCCCC', 'fwd_test');
    addPrimer('aaaaaaaa', 'rvs_test');
    addPrimer('aaGCGGCCGCgtagaactttatgtgcttccttacattggt', 'fwd-hyb');
    addPrimer('aaGCGGCCGCaccaatgtaaggaagcacataaagttctac', 'rvs-hyb');
    cy.get('button.MuiTab-root').contains('Cloning').click();
    addSource('oligonucleotide_hybridization', true);
    clickMultiSelectOption('Forward primer', 'fwd_test', 'li#source-1');
    clickMultiSelectOption('Reverse primer', 'rvs_test', 'li#source-1');
    cy.get('button').contains('Perform hybridization').click();
    cy.get('.MuiAlert-message').contains('No pair of annealing oligos');
    clickMultiSelectOption('Forward primer', 'fwd-hyb', 'li#source-1');
    clickMultiSelectOption('Reverse primer', 'rvs-hyb', 'li#source-1');
    setInputValue('Minimal annealing length (in bp)', '8', 'li#source-1');
    cy.get('button').contains('Perform hybridization').click();
    cy.get('.MuiAlert-message').contains('No pair of annealing oligos');
  });
});
