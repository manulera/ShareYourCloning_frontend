async function responseGenerator(req) {
  if (req.body.user_input === 'atata') {
    req.reply({ statusCode: 200, fixture: 'manually_typed/correct/response_body.json' });
  } else {
    throw Error('unhandled input');
  }
}

describe('ManuallyTyped Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="manually_typed"]').click();
    cy.intercept('POST', '**/manually_typed', (req) => responseGenerator(req)).as('manuallyTyped');
  });
  it('works on normal case', () => {
    cy.get('#tab-panel-0 #sequence').clear('a');
    cy.get('#tab-panel-0 #sequence').type('atata');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.wait('@manuallyTyped').its('response.statusCode').should('eq', 200);
    cy.get('.select-source > :nth-child(2)').should('have.text', 'Manually typed sequence');
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
