import { getReverseComplementSequenceString } from '@teselagen/sequence-utils';
import { addPrimer, addSource, manuallyTypeSequence, clickMultiSelectOption, setInputValue, deleteSource, addLane, skipGoogleSheetErrors, skipNcbiCheck, deleteSourceById, loadExample, deleteSourceByContent } from './common_functions';

describe('Tests PCR functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    skipNcbiCheck();
  });
  it('works in the normal case', () => {
    loadExample('Gateway cloning');
    deleteSourceByContent('Gateway BP reaction');
    addSource('GatewaySource');
    clickMultiSelectOption('Assembly inputs', '8');

    // Submit icon not visible
    cy.get('.share-your-cloning button.submit-backend-api').should('not.exist');
    clickMultiSelectOption('Reaction type', 'BP');
    cy.get('.share-your-cloning button.submit-backend-api').click();
    // Only one possible output should have been created
    cy.get('.share-your-cloning li').contains('Gateway BP reaction', { timeout: 20000 }).should('exist');

    // Submit again with single-site recombination
    addSource('GatewaySource');
    clickMultiSelectOption('Assembly inputs', 'Select all');
    clickMultiSelectOption('Reaction type', 'LR');
    // Toggle Single-site recombination
    // cy.get('label').contains('Single-site recombination').siblings('div').children('input').click();
    // cy.get('.share-your-cloning button.submit-backend-api').click();

    // cy.get('.share-your-cloning li').contains('Gateway BP reaction').should('exist');
  });
});
