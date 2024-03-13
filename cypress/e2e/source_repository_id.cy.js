describe('RepositoryId Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="repository_id"]').click();
    cy.intercept('**').as('request');
  });
  it('works with addgene', () => {
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="addgene"]').click();
    cy.get('#repository-id-1').clear('3');
    cy.get('#repository-id-1').type('39282');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .node-text > .corner-id').should('have.text', '2');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('pFA6a');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('5086 bps');
    cy.get('.select-source > :nth-child(2)').should('have.text', 'Request to addgene with ID 39282 ');
    // links to https://www.addgene.org/39282/sequences/
    cy.get('li#source-1 a[href="https://www.addgene.org/39282/sequences/"]').should('be.visible');
  });
  it('works with genbank', () => {
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="genbank"]').click();
    cy.get('#repository-id-1').clear('');
    cy.get('#repository-id-1').type('NM_001018957.2');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.wait('@request', { requestTimeout: 20000 });
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .node-text > .corner-id').should('have.text', '2');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('NM_001018957.2');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1)').contains('2671 bps');
    cy.get('.select-source > :nth-child(2)').should('have.text', 'Request to genbank with ID NM_001018957.2 ');
    // links to https://www.ncbi.nlm.nih.gov/nuccore/NM_001018957.2
    cy.get('li#source-1 a[href="https://www.ncbi.nlm.nih.gov/nuccore/NM_001018957.2"]').should('be.visible');
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
