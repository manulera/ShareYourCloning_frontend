import { addSource, manuallyTypeSequence, clickMultiSelectOption, loadHistory, deleteSourceById, skipGoogleSheetErrors, skipNcbiCheck } from '../common_functions';

describe('Tests Gibson assembly functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    skipNcbiCheck();
  });
  it('works in the normal case', () => {
    loadHistory('cypress/test_starting_point/source_gibson_assembly.json');
    cy.get('li#sequence-4', { timeOut: 20000 });
    addSource('GibsonAssemblySource');
    clickMultiSelectOption('Assembly inputs', '4', 'li#source-7');
    clickMultiSelectOption('Assembly inputs', '6', 'li#source-7');

    cy.get('li#source-7 li#sequence-2').should('exist');
    cy.get('li#source-7 li#sequence-4').should('exist');
    cy.get('li#source-7 li#sequence-6').should('exist');
    cy.get('li#source-7 button').contains('Submit').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });

    cy.get('li#source-7').contains('Gibson assembly');

    cy.get('li#sequence-8').contains('Payload 1');
    cy.get('li#sequence-8').contains('Payload 2');
    cy.get('li#sequence-8').contains('Payload 3');
  });
  it('correctly applies circular constrain and shows the right errors', () => {
    loadHistory('cypress/test_starting_point/source_gibson_assembly.json');
    cy.get('li#sequence-4', { timeOut: 20000 });
    // Remove sequence that allows circularisation
    deleteSourceById(1);
    addSource('GibsonAssemblySource');
    clickMultiSelectOption('Assembly inputs', '6', 'li#source-7');
    // Constrain to circular
    cy.get('#tab-panel-0 span').contains('Circular assemblies').click();
    // Should show an error
    cy.get('li#source-7 button').contains('Submit').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });
    cy.get('li#source-7 .MuiAlert-message').contains('No circular assembly');
    // Remove the circular constraint
    cy.get('#tab-panel-0 span').contains('Circular assemblies').click();
    cy.get('li#source-7 button').contains('Submit').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });
    cy.get('li#source-7').contains('Gibson assembly');
    cy.get('li#sequence-8').contains('Payload 2');
    cy.get('li#sequence-8').contains('Payload 3');
  });
  it('works for single inputs', () => {
    manuallyTypeSequence('aagaattcaaaaGTCGACaacccccaagaattcaaaaGTCGACaa');
    addSource('GibsonAssemblySource');
    cy.get('li#source-3 button').contains('Submit').click();
    cy.get('.submit-backend-api .loading-progress').should('not.exist', { timeout: 20000 });
    cy.get('li#sequence-4 li#source-3').contains('Gibson assembly');
    cy.get('li#sequence-4').contains('25 bps');
  });
});

// TODO: minimal homology, resubmission, errors from server
