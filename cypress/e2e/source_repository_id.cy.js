describe('RepositoryId Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="repository_id"]').click();
    // cy.intercept('POST', '**/repository_id', (req) => responseGenerator(req)).as('repositoryId');
  });
  it('works with normal case', () => {
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="addgene"]').click();
    cy.get('#repository-id-1').clear('3');
    cy.get('#repository-id-1').type('39282');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .node-text > .corner-id').should('have.text', '2');
  });
  it('handles empty submissions and wrong IDs', () => {
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="addgene"]').click();
    cy.get('#repository-id-1').clear('');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('#repository-id-1-helper-text').should('have.text', 'Field cannot be empty');
    cy.get('#repository-id-1').clear('a');
    cy.get('#repository-id-1').type('aaa');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('.MuiAlert-message').should('be.visible');
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="genbank"]').click();
    cy.get('#repository-id-1').clear('');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('#repository-id-1-helper-text').should('have.text', 'Field cannot be empty');
    cy.get('#repository-id-1').clear('a');
    cy.get('#repository-id-1').type('aaa');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('.MuiAlert-message').should('be.visible');
  });
});
