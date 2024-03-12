const allOptions = ['restriction', 'PCR', 'ligation', 'gibson_assembly', 'homologous_recombination', 'restriction_and_ligation'];
const multiInputOptions = ['ligation', 'gibson_assembly', 'homologous_recombination', 'restriction_and_ligation'];
function checkAllOptions(sourceId) {
  cy.get(`ul[aria-labelledby="select-source-${sourceId}-label"] li`).should('have.length', allOptions.length);
  allOptions.forEach((value) => {
    cy.get(`ul[aria-labelledby="select-source-${sourceId}-label"] li[data-value="${value}"]`).should('exist');
  });
}
function checkMultiInputOptions(sourceId) {
  cy.get(`ul[aria-labelledby="select-source-${sourceId}-label"] li`).should('have.length', multiInputOptions.length);
  multiInputOptions.forEach((value) => {
    cy.get(`ul[aria-labelledby="select-source-${sourceId}-label"] li[data-value="${value}"]`).should('exist');
  });
}

describe('Test Source input constrains', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  //   it('Empty source displays the right options', () => {
  //     cy.get('#tab-panel-0 .MuiInputBase-root').click();
  //     cy.get('ul[aria-labelledby="select-source-1-label"] li').should('have.length', 4);
  //     cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="repository_id"]').should('exist');
  //     cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="manually_typed"]').should('exist');
  //     cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="genome_region"]').should('exist');
  //     cy.get('ul[aria-labelledby="select-source-1-label"] li[data-value="file"]').should('exist');
  //   });
  //   it('All experimental sources are available as children of a sequence', () => {
  //     cy.get('#tab-panel-0 .MuiInputBase-root').click();
  //     cy.get('li[data-value="manually_typed"]').click();
  //     cy.get('#tab-panel-0 #sequence').type('atata');
  //     cy.get('.select-source > form > .MuiButtonBase-root').click();
  //     cy.get('svg[data-testid="AddCircleIcon"]').first().click();
  //     cy.get('li#source-3 .MuiInputBase-root').click();
  //     checkAllOptions(3);
  //   });
  it('All experimental sources are available as children of a sequence', () => {
    // Manually type one sequence
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="manually_typed"]').click();
    cy.get('#tab-panel-0 #sequence').type('atata');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    // Manually type another one
    cy.get('svg[data-testid="AddCircleIcon"]').last().click();
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="manually_typed"]').click();
    cy.get('#tab-panel-0 #sequence').type('atata');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    // Go into PCR
    cy.get('svg[data-testid="AddCircleIcon"]').first().click();
    cy.get('li#source-5 .MuiInputBase-root').click();
    checkAllOptions(5);
    cy.get('body').click(0, 0);
    // Change to multi-input
    multiInputOptions.forEach((value) => {
      if (value !== 'homologous_recombination') {
        cy.get('li#source-5 .MuiInputBase-root').eq(0).click();
        cy.get(`li[data-value="${value}"]`).click();
        cy.get('li#source-5 .MuiInputBase-root').eq(0).click();
        // Should have all options since there is only one input
        cy.get('ul[aria-labelledby="select-source-5-label"] li').should('have.length', 6);
        cy.get(`li[data-value="${value}"]`).click();
        // Add another source
        cy.get('li#source-5 .MuiInputBase-root').eq(1).click();
        // Two inputs listed
        cy.get('ul[role="listbox"] li').should('have.length', 2);
        // Select the second input and click outside to close select element
        cy.get('li[data-value="4"]').click();
        cy.get('body').click(0, 0);
        // Now there should only be 4 options
        cy.get('li#source-5 .MuiInputBase-root').eq(0).click();
        checkMultiInputOptions(5);
        cy.get('body').click(0, 0);
        // We unselect the second input
        cy.get('li#source-5 .MuiInputBase-root').eq(1).click();
        cy.get('li[data-value="4"]').click();
        cy.get('body').click(0, 0);
        // We are back to having 6 options
        cy.get('li#source-5 .MuiInputBase-root').eq(0).click();
        checkAllOptions(5);
        cy.get('body').click(0, 0);
      } else {
        cy.log('Skipping homologous_recombination');
        console.warn('Skipping homologous_recombination');
        // cy.get('li#source-5 .MuiInputBase-root').eq(2).click();
        // cy.get('li[data-value="4"]').click();
        // cy.get('li#source-5 .MuiInputBase-root').eq(0).click();
        // checkMultiInputOptions(5);
        // cy.get('body').click(0, 0);
        // cy.get('li#source-5 .MuiInputBase-root').eq(2).click();
        // cy.get('li[data-value="2"]').click();
        // cy.get('li#source-5 .MuiInputBase-root').eq(0).click();
        // checkAllOptions(5);
        // cy.get('body').click(0, 0);
      }
    });
  });
});
