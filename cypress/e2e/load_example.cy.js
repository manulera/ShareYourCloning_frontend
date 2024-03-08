describe('RepositoryId Source', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Can load examples', () => {
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('Examples').click();
    cy.get('li span').contains('Integration of cassette by homologous recombination').click();
    // Loads cloning
    cy.get('div.cloning-tab-pannel').contains('Request to addgene with ID 19342');
    cy.get('div.cloning-tab-pannel').contains('4548 bps');
    cy.get('div.cloning-tab-pannel').should('be.visible');
    cy.get('div.description-tab-pannel').should('not.be.visible');
    // Loads primers
    cy.get('div.primer-tab-pannel').contains('AGTTTTCATATCTTCCTTTATATTCTATTAATTGAATTTCAAACATCGTTTTATTGAGCTCATTTACATCAACCGGTTCACGGATCCCCGGGTTAATTAA');
    cy.get('div.primer-tab-pannel').contains('CTTTTATGAATTATCTATATGCTGTATTCATATGCAAAAATATGTATATTTAAATTTGATCGATTAGGTAAATAAGAAGCGAATTCGAGCTCGTTTAAAC');
    // Loads description
    cy.get('div.description-tab-pannel').contains('Deletion of the ORF');
    // It's set to not-edit mode
    cy.get('div.description-tab-pannel button').contains('Edit description').should('exist');
    // The data model is loaded and displayed
    cy.get('div.data-model-tab-pannel code').contains('"input": [],');
  });
});
