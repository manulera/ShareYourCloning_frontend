import { loadExample } from './common_functions';

describe('Test upload history from file', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Can upload a correct json file', () => {
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/restriction_then_ligation.json', { force: true });
    cy.get('div.cloning-tab-pannel').contains('PCR with primers fwd and rvs');
    cy.get('div.cloning-tab-pannel').should('be.visible');
    cy.get('div.description-tab-pannel').should('not.be.visible');
  });
  it('Can merge with existing history', () => {
    loadExample('CRISPR HDR');
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/restriction_then_ligation.json', { force: true });
    cy.get('.history-loaded-dialog').contains('Add to existing').click();
    cy.get('.history-loaded-dialog button').contains('Select').click();
    // Previous
    cy.get('div.cloning-tab-pannel').contains('CRISPR HDR with');
    // Newly loaded
    cy.get('div.cloning-tab-pannel').contains('Ligation of fragments');

    // Cannot load one with the same primer names again
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/crispr_hdr.json', { force: true });
    cy.get('.history-loaded-dialog').contains('Add to existing').click();
    cy.get('.history-loaded-dialog button').contains('Select').click();

    // Shows error and does not load them again
    cy.get('.MuiAlert-message').contains('Primer name from loaded file exists in current session').should('exist');
    cy.get('div.cloning-tab-pannel').contains('CRISPR HDR with').should('have.length', 1);

    // Can replace the history
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/crispr_hdr.json', { force: true });
    cy.get('.history-loaded-dialog').contains('Replace existing').click();
    cy.get('.history-loaded-dialog button').contains('Select').click();

    cy.get('div.cloning-tab-pannel').contains('Ligation of fragments').should('not.exist');
    cy.get('div.cloning-tab-pannel').contains('CRISPR HDR with').should('exist');
  });
  it('Gives an error message for an incorrect type of file', () => {
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/ase1.gb', { force: true });
    cy.get('.MuiAlert-message').contains('should be a JSON');
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/wrong_history.json', { force: true });
    cy.get('.MuiAlert-message').contains('JSON file in wrong format');
  });
});
