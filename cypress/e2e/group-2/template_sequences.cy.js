import { loadHistory, skipGoogleSheetErrors} from '../common_functions';

describe('Tests template functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    
  });
  it('can add sequence in between for templates', () => {
    loadHistory('cypress/test_files/template_example.json');

    // The add in between is displayed where it should
    cy.get('li#source-5 div.before-node-sequence-in-between').should('exist');
    cy.get('li#source-7 div.before-node-sequence-in-between').should('exist');
    cy.get('div.before-node-sequence-in-between').should('have.length', 2);

    // On normal sequences it is not displayed
    cy.get('li#source-10 div.before-node-visibility').should('exist');
    cy.get('div.before-node-visibility').should('have.length', 1);

    // When adding one it works for single input source
    cy.get('li#source-5 div.before-node-sequence-in-between').click();
    cy.get('li#source-5 li#sequence-13 li#source-12 li#sequence-2').should('exist');

    // When adding one it works for multi input source
    cy.get('li#source-7 div.before-node-sequence-in-between').first().click();
    cy.get('li#source-7 li#sequence-15 li#source-14 li#sequence-4 li#source-3').should('exist');
    cy.get('li#source-7 li#sequence-15 li#source-14 li#sequence-6 li#source-5').should('exist');
  });
});
