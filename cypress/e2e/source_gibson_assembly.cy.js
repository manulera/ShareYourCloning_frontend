import { addSource, manuallyTypeSequence, clickMultiSelectOption, loadHistory, deleteSource } from './common_functions';

describe('Tests Gibson assembly functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('works in the normal case', () => {
    loadHistory('cypress/test_starting_point/source_gibson_assembly.json');
    deleteSource(7);
    addSource('gibson_assembly');
    clickMultiSelectOption('Input sequences', '4', 'li#source-7');
    clickMultiSelectOption('Input sequences', '6', 'li#source-7');

    cy.get('li#source-7 li#sequence-2').should('exist');
    cy.get('li#source-7 li#sequence-4').should('exist');
    cy.get('li#source-7 li#sequence-6').should('exist');
    cy.get('li#source-7 button').contains('Submit').click();

    cy.get('li#source-7').contains('Gibson assembly');

    cy.get('li#sequence-8').contains('Payload 1');
    cy.get('li#sequence-8').contains('Payload 2');
    cy.get('li#sequence-8').contains('Payload 3');
  });
  it('correctly applies circular constrain and shows the right errors', () => {
    loadHistory('cypress/test_starting_point/source_gibson_assembly.json');
    deleteSource(7);
    // Remove sequence that allows circularisation
    deleteSource(1);
    addSource('gibson_assembly');
    clickMultiSelectOption('Input sequences', '6', 'li#source-7');
    // Constrain to circular
    cy.get('#tab-panel-0 span').contains('Circular assemblies').click();
    // Should show an error
    cy.get('li#source-7 button').contains('Submit').click();
    cy.get('li#source-7 .MuiAlert-message').contains('No circular assembly');
    // Remove the circular constraint
    cy.get('#tab-panel-0 span').contains('Circular assemblies').click();
    cy.get('li#source-7 button').contains('Submit').click();
    cy.get('li#source-7').contains('Gibson assembly');
    cy.get('li#sequence-8').contains('Payload 2');
    cy.get('li#sequence-8').contains('Payload 3');
  });
  it('works for single inputs', () => {
    manuallyTypeSequence('aagaattcaaaaGTCGACaacccccaagaattcaaaaGTCGACaa');
    addSource('gibson_assembly');
    cy.get('li#source-3 button').contains('Submit').click();
    cy.get('li#sequence-4 li#source-3').contains('Gibson assembly');
    cy.get('li#sequence-4').contains('25 bps');
  });
});

// TODO: minimal homology, resubmission, errors from server
