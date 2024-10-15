import { skipGoogleSheetErrors, skipNcbiCheck } from './common_functions';

describe('Test delete source functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    skipNcbiCheck();
  });
  it('Has the correct delete chain', () => {
    // Deletes the right children
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('Examples').click();
    cy.get('li span').contains('Integration of cassette by homologous recombination').click();
    cy.get('#source-1 [data-testid="DeleteIcon"]').click();
    cy.get('li#source-1').should('not.exist');
    cy.get('li#source-3').should('not.exist');
    cy.get('li#source-7').should('not.exist');
    cy.get('li#sequence-8').should('not.exist');

    cy.get('li#source-5').should('exist');
    cy.get('li#sequence-6').should('exist');

    // // Does not delete parents if the last child is deleted
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('Examples').click();
    cy.get('li span').contains('Integration of cassette by homologous recombination').click();
    cy.get('div.select-source').contains('Homologous recombination').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    cy.get('li#source-7').should('not.exist');
    cy.get('li#sequence-8').should('not.exist');

    cy.get('li#sequence-4').should('exist');
    cy.get('li#sequence-6').should('exist');
  });
});
