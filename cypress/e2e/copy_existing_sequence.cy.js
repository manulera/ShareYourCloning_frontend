import { addLane, addSource, clickMultiSelectOption, manuallyTypeSequence, skipGoogleSheetErrors, skipNcbiCheck } from './common_functions';

describe('Test copy existing sequence functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    skipNcbiCheck();
  });
  it('Copies the correct sequence', () => {
    manuallyTypeSequence('ACGT');
    addLane();
    addSource('CopyEntity', true);
    clickMultiSelectOption('Sequence to copy', '2', 'li#source-3');
    cy.get('button').contains('Copy sequence').click();
    cy.get('li#source-4').should('exist');
    cy.get('li#source-5').should('exist');

    // There should be 2 sequence with #sequence-2
    cy.get('li#sequence-2').should('have.length', 2);
    cy.get('li#source-1').should('have.length', 2);

    // Deleting either source should delete both
    cy.get('#source-1 [data-testid="DeleteIcon"]').first().click();
    cy.get('li#source-1').should('not.exist');
    cy.get('li#sequence-2').should('not.exist');
  });
});
