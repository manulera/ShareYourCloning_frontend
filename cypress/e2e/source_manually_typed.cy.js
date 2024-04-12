describe('ManuallyTyped Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="manually_typed"]').click();
    cy.intercept('**').as('request');
  });
  it('works on normal case', () => {
    cy.get('#tab-panel-0 #sequence').clear('a');
    cy.get('#tab-panel-0 #sequence').type('atata');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('.select-source > :nth-child(2)', { timeout: 20000 }).should('have.text', 'Manually typed sequence');
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .node-text > .corner-id').should('have.text', '2');
  });

  it('works only with ACGT', () => {
    cy.get('.tf-tree').click();
    cy.get('#tab-panel-0 #sequence').clear('a');
    cy.get('#tab-panel-0 #sequence').type('ayayay');
    cy.get('#tab-panel-0 #sequence-helper-text').should('have.text', 'invalid DNA sequence');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('#tab-panel-0 #sequence-helper-text').should('have.text', 'invalid DNA sequence');
    cy.get('#tab-panel-0 #sequence').clear('');
    cy.get('#tab-panel-0 #sequence-helper-text').should('have.text', 'Field required');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('#tab-panel-0 #sequence-helper-text').should('have.text', 'Field required');
  });
});
