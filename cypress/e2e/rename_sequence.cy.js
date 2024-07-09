import { clearInputValue, manuallyTypeSequence, setInputValue } from './common_functions';

describe('Can rename a sequence', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Works as expected', () => {
    manuallyTypeSequence('atata');
    cy.get('li#sequence-2 .sequenceNameText').contains('name').should('exist');
    cy.get('li#sequence-2 svg[data-testid="EditIcon"]').click();
    // Cannot submit if name didn't change
    cy.get('div[role="presentation"] button').contains('Cancel').should('exist');
    cy.get('div[role="presentation"] button').contains('Rename').should('not.exist');
    // Cannot submit if empty
    clearInputValue('New name', 'div[role="presentation"]');
    cy.get('div[role="presentation"] button').contains('Cancel').should('exist');
    cy.get('div[role="presentation"] button').contains('Rename').should('not.exist');
    // Back to previous name
    // For some reason we have to click outside, I think the tooltip is messing this up
    cy.get('div[role="presentation"]').contains('Rename sequence').first().click();
    setInputValue('New name', 'name', 'div[role="presentation"]');
    cy.get('div[role="presentation"] button').contains('Cancel').should('exist');
    cy.get('div[role="presentation"] button').contains('Rename').should('not.exist');
    // Can submit if name changed
    setInputValue('New name', 'name-2', 'div[role="presentation"]');
    cy.get('div[role="presentation"] button').contains('Cancel').should('exist');
    cy.get('div[role="presentation"] button').contains('Rename').should('exist');
    cy.get('div[role="presentation"] button').contains('Rename').click();
    // The field is set in the data model
    cy.get('button.MuiTab-root').contains('Data model').click();
    cy.get('code').contains('"output_name": "name-2"').should('exist');
  });
});
