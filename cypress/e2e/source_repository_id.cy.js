import { addSource, clickMultiSelectOption, setInputValue } from './common_functions';

describe('RepositoryId Source', () => {
  beforeEach(() => {
    cy.visit('/');
    addSource('RepositoryIdSource', true);
  });
  it('works with addgene', () => {
    clickMultiSelectOption('Select repository', 'AddGene', 'li#source-1');
    setInputValue('ID in repository', '39282', 'li#source-1');
    cy.get('button.MuiButtonBase-root').contains('Submit').click();
    cy.get('li#sequence-2 .corner-id', { timeout: 20000 }).first().should('have.text', '2');
    cy.get('li#sequence-2 li#source-1').should('exist');
    cy.get('li#sequence-2 li#source-1').contains('Request to addgene with ID 39282');
    cy.get('li#sequence-2').contains('pFA6a');
    cy.get('li#sequence-2').contains('5086 bps');
    // links to https://www.addgene.org/39282/sequences/
    cy.get('li#source-1 a[href="https://www.addgene.org/39282/sequences/"]').should('be.visible');
  });
  it('works with genbank', () => {
    cy.get('body').click();
    cy.get('div[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="genbank"]').click();
    cy.get('#repository-id-1').clear('');
    cy.get('#repository-id-1').type('NM_001018957.2');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('li#sequence-2 .corner-id', { timeout: 20000 }).first().should('have.text', '2');
    cy.get('li#sequence-2 li#source-1').should('exist');
    cy.get('li#sequence-2 li#source-1').contains('Request to genbank with ID NM_001018957.2 ');
    cy.get('li#sequence-2').contains('NM_001018957.2');
    cy.get('li#sequence-2').contains('2671 bps');

    // links to https://www.ncbi.nlm.nih.gov/nuccore/NM_001018957.2
    cy.get('li#source-1 a[href="https://www.ncbi.nlm.nih.gov/nuccore/NM_001018957.2"]').should('be.visible');
  });
  it('handles empty submissions and wrong IDs', () => {
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="addgene"]').click();
    cy.get('#repository-id-1').clear('');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('#repository-id-1-helper-text').should('have.text', 'Field cannot be empty');
    cy.get('#repository-id-1').clear('a');
    cy.get('#repository-id-1').type('aaa');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('.MuiAlert-message', { timeout: 20000 }).should('be.visible');
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="genbank"]').click();
    cy.get('#repository-id-1').clear('');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('#repository-id-1-helper-text').should('have.text', 'Field cannot be empty');
    cy.get('#repository-id-1').clear('a');
    cy.get('#repository-id-1').type('aaa');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('.MuiAlert-message', { timeout: 20000 }).should('be.visible');
  });
});
