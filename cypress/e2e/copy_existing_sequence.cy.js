import { addLane, addSource, clickMultiSelectOption, deleteSourceByContent, manuallyTypeSequence, skipGoogleSheetErrors, skipNcbiCheck } from './common_functions';

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
    cy.get('li#source-1').should('exist');
    cy.get('li#source-3').should('exist');

    // Deleting one does not delete the other
    deleteSourceByContent('typed');
    cy.get('li#source-3').should('exist');
    cy.get('li#sequence-4').should('exist');
    cy.get('li#source-1').should('not.exist');
    cy.get('li#sequence-2').should('not.exist');
  });
});
