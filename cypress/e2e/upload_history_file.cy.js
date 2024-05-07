describe('Test upload history from file', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Can upload a correct json file', () => {
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/restriction_then_ligation.json', { force: true });
    cy.get('div.cloning-tab-pannel').contains('4718 bps');
    cy.get('div.cloning-tab-pannel').should('be.visible');
    cy.get('div.description-tab-pannel').should('not.be.visible');
  });
  it('Gives an error message for an incorrect type of file', () => {
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/ase1.gb', { force: true });
    cy.get('.MuiAlert-message').contains('should be a JSON');
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile('public/examples/wrong_history.json', { force: true });
    cy.get('.MuiAlert-message').contains('JSON file in wrong format');
  });
});
