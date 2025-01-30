import { addLane, addSource, clickMultiSelectOption, manuallyTypeSequence, skipGoogleSheetErrors, skipNcbiCheck } from '../common_functions';

describe('Test polymerase extension functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    skipGoogleSheetErrors();
    skipNcbiCheck();
  });

  it('performs polymerase extension correctly and applies the right constraints', () => {
    // Add first sequence
    manuallyTypeSequence('ACGTACGT');
    addSource('PolymeraseExtensionSource');
    // Should show an alert since there are no overhangs
    cy.get('.MuiAlert-message').contains('Invalid input');

    // Add second sequence with wrong overhangs
    addLane();
    manuallyTypeSequence('GCGCACGT', false, [3, 3]);
    addSource('PolymeraseExtensionSource');
    // Should show an alert since there are no overhangs
    cy.get('li#source-6 .MuiAlert-message').contains('Invalid input');

    // Add third sequence with correct overhangs
    addLane();
    manuallyTypeSequence('GCGCACGT', false, [-3, -3]);
    addSource('PolymeraseExtensionSource');
    cy.get('li#source-9 button').contains('Extend with').click();
    cy.get('li#sequence-10').should('exist');
    cy.get('li#sequence-10 > span .overhang-representation').should('not.exist');
  });
});
