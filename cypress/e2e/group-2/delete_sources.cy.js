import { addLane, changeTab, deleteSourceByContent, deleteSourceById, loadExample, manuallyTypeSequence } from '../common_functions';

describe('Test delete source functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Has the correct delete chain', () => {
    // Deletes the right children
    loadExample('homologous recombination');
    // Validate that a warning dialog opens in this case
    cy.get('.open-cloning').contains('addgene').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    cy.get('.verify-delete-dialog').should('exist');
    // No special warning
    cy.get('.verify-delete-dialog .MuiAlert-message').should('not.exist');
    // Click outside the dialog does not delete
    cy.get('.verify-delete-dialog').click('topLeft');
    cy.get('.open-cloning').contains('addgene').should('exist');
    // Same by clicking on cancel
    cy.get('.open-cloning').contains('addgene').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    cy.get('.verify-delete-dialog').should('exist');
    cy.get('.verify-delete-dialog .MuiButtonBase-root').contains('Cancel').click();
    cy.get('.open-cloning').contains('addgene').should('exist');

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
    cy.get('.open-cloning').contains('Homologous recombination').parent('div.select-source').find('[data-testid="DeleteIcon"]')
      .click();
    // No dialog opens
    cy.get('.verify-delete-dialog').should('not.exist');
    cy.get('li#source-7').should('not.exist');
    cy.get('li#sequence-8').should('not.exist');

    cy.get('li#sequence-4').should('exist');
    cy.get('li#sequence-6').should('exist');
  });
  it('Unsets main sequence and removes it from the editor', () => {
    manuallyTypeSequence('ATGC');
    addLane();
    manuallyTypeSequence('ATGC');
    cy.get('li#sequence-2 svg[data-testid="VisibilityIcon"]').should('have.css', 'color', 'rgb(128, 128, 128)');
    cy.get('li#sequence-2 svg[data-testid="VisibilityIcon"]').click();
    cy.get('li#sequence-2 svg[data-testid="VisibilityIcon"]').should('not.have.css', 'color', 'rgb(128, 128, 128)');
    changeTab('Sequence');
    cy.get('.main-sequence-editor').contains('4 bps').should('be.visible');
    changeTab('Cloning');
    deleteSourceById(3);
    changeTab('Sequence');
    cy.get('.main-sequence-editor').contains('4 bps').should('be.visible');
    changeTab('Cloning');
    deleteSourceById(1);
    changeTab('Sequence');
    cy.get('.main-sequence-editor').contains('4 bps').should('not.exist');
    // Create a new sequence and check that the main sequence is not set
    changeTab('Cloning');
    addLane();
    manuallyTypeSequence('ATGC');
    cy.get('li#sequence-2 svg[data-testid="VisibilityIcon"]').should('have.css', 'color', 'rgb(128, 128, 128)');
  });
});
