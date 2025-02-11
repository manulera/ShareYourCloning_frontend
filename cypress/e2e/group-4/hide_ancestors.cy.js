import { loadExample } from '../common_functions';

describe('Tests primer functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Hides ancestors', () => {
    loadExample('homologous recombination');
    // Hide top
    cy.contains('li', 'PCR with primers').find('[aria-label="Hide ancestors"] svg').first().click();
    cy.contains('li', 'Request to addgene').should('not.be.visible');
    // Hide everything esle
    cy.contains('li', 'Homologous recombination').find('[aria-label="Hide ancestors"] svg').first().click();
    cy.contains('li', 'Request to addgene').should('not.be.visible');
    cy.contains('li', 'PCR with primers').should('not.be.visible');
    cy.contains('li', 'Genome region').should('not.be.visible');
    // Show some, but not the 1st one since it remains hidden
    cy.contains('li', 'Homologous recombination').find('[aria-label="Show ancestors"] svg').first().click();
    // Scroll to top to ensure all elements are in view
    cy.get('.tab-panels-container').scrollTo('top');
    cy.contains('li', 'Request to addgene').should('not.be.visible');
    cy.contains('li', 'PCR with primers').should('be.visible');
    cy.contains('li', 'Genome region').should('be.visible');
    // Show all
    cy.contains('li', 'PCR with primers').find('[aria-label="Show ancestors"] svg').first().click();
    cy.get('.tab-panels-container').scrollTo('top');
    cy.contains('li', 'Request to addgene').should('be.visible');
    cy.contains('li', 'PCR with primers').should('be.visible');
    cy.contains('li', 'Genome region').should('be.visible');
  });
});
