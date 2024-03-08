describe('Test download history from file', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Can download the file', () => {
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('Examples').click();
    cy.get('li span').contains('Integration of cassette by homologous recombination').click();
    cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').click();
    cy.get('[role="menuitem"]').contains('Save to file').click();
    cy.task('readFileMaybe', 'cypress/downloads/file.json').then((fileContent) => {
      expect(fileContent).to.include('"sequences":');
      expect(fileContent).to.include('"sources":');
      expect(fileContent).to.include('"primers":');
      expect(fileContent).to.include('"description":');
    });
  });
});
