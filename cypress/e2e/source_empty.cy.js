describe('RepositoryId Source', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Creates / deletes empty sources', () => {
    cy.get('svg[data-testid="AddCircleIcon"]').parent().click();
    cy.get('li#source-1').should('exist');
    cy.get('li#source-2').should('exist');
    cy.get('li#source-3').should('not.exist');
    cy.get('svg[data-testid="AddCircleIcon"]').parent().click();
    cy.get('li#source-1').should('exist');
    cy.get('li#source-2').should('exist');
    cy.get('li#source-3').should('exist');
    cy.get('li#source-1 svg[data-testid="DeleteIcon"]').eq(0).click();
    cy.get('li#source-1').should('not.exist');
    cy.get('li#source-2 svg[data-testid="DeleteIcon"]').eq(0).click();
    cy.get('li#source-3 svg[data-testid="DeleteIcon"]').eq(0).click();
    // There is still a button to create a new one
    cy.get('div.tf-tree svg[data-testid="AddCircleIcon"]').should('exist');
  });
  it('Displays the right options', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('ul[aria-labelledby="select-source-1-label"] li').should('have.length', 4);
    cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="repository_id"]').should('exist');
    cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="manually_typed"]').should('exist');
    cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="genome_region"]').should('exist');
    cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="file"]').should('exist');
  });
});
