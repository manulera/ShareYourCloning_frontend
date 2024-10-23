import { addLane, addSource, clickMultiSelectOption, deleteSourceByContent, loadExample, skipGoogleSheetErrors, skipNcbiCheck } from './common_functions';

describe('Test delete source functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    skipNcbiCheck();
  });
  it('Has the correct delete chain', () => {
    // Deletes the right children
    loadExample('homologous recombination');
    // Validate that a warning dialog opens in this case
    cy.get('.share-your-cloning').contains('addgene').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    cy.get('.verify-delete-dialog').should('exist');
    // No special warning
    cy.get('.verify-delete-dialog .MuiAlert-message').should('not.exist');
    // Click outside the dialog does not delete
    cy.get('.verify-delete-dialog').click('topLeft');
    cy.get('.share-your-cloning').contains('addgene').should('exist');
    // Same by clicking on cancel
    cy.get('.share-your-cloning').contains('addgene').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    cy.get('.verify-delete-dialog').should('exist');
    cy.get('.verify-delete-dialog .MuiButtonBase-root').contains('Cancel').click();
    cy.get('.share-your-cloning').contains('addgene').should('exist');

    // Clicking on delete does delete
    deleteSourceByContent('addgene');
    cy.get('li#source-1').should('not.exist');
    cy.get('li#source-3').should('not.exist');
    cy.get('li#source-7').should('not.exist');
    cy.get('li#sequence-8').should('not.exist');

    cy.get('li#source-5').should('exist');
    cy.get('li#sequence-6').should('exist');

    // // Does not delete parents if the last child is deleted
    loadExample('homologous recombination');
    cy.get('.share-your-cloning').contains('Homologous recombination').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    // No dialog opens
    cy.get('.verify-delete-dialog').should('not.exist');
    cy.get('li#source-7').should('not.exist');
    cy.get('li#sequence-8').should('not.exist');

    cy.get('li#sequence-4').should('exist');
    cy.get('li#sequence-6').should('exist');
  });
});
