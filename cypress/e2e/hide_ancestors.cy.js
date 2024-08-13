import { loadExample } from './common_functions';

describe('Tests primer functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Hides ancestors', () => {
    loadExample('homologous recombination');
    // Hide top
    cy.get('li#source-7 [aria-label="Hide ancestors"] svg').first().click();
    cy.get('li#source-1').should('not.be.visible');
    // Hide everything esle
    cy.get('li#source-9 [aria-label="Hide ancestors"] svg').first().click();
    cy.get('li#source-1').should('not.be.visible');
    cy.get('li#source-7').should('not.be.visible');
    cy.get('li#source-5').should('not.be.visible');
    // Show some, but not the 1st one since it remains hidden
    cy.get('li#source-9 [aria-label="Show ancestors"] svg').first().click();
    cy.get('li#source-1').should('not.be.visible');
    cy.get('li#source-7').should('be.visible');
    cy.get('li#source-5').should('be.visible');
    // Show all
    cy.get('li#source-7 [aria-label="Show ancestors"] svg').first().click();
    cy.get('li#source-1').should('be.visible');
    cy.get('li#source-7').should('be.visible');
    cy.get('li#source-5').should('be.visible');
  });
});
