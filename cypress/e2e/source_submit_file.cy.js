import { addSource } from './common_functions';

describe('File Source', () => {
  beforeEach(() => {
    cy.visit('/');
    addSource('UploadedFileSource', 1);
  });
  it('works on normal case', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('.MuiButtonBase-root > input').selectFile('public/examples/ase1.gb', { force: true });
    cy.get('li#sequence-2', { timeout: 20000 }).should('have.text', 'CU329670 ');
    cy.get('li#sequence-2 li#source-1').contains('Read from uploaded file ase1.gb');
  });
  it('gives the right error when file has a wrong extension', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('.MuiButtonBase-root > input').selectFile('cypress/test_files/wrong_extension.txt', { force: true });
    cy.get('li#source-1 .MuiAlert-message').contains('We could not guess the format');
  });
  it('gives the right error when file has a wrong content', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('.MuiButtonBase-root > input').selectFile('cypress/test_files/wrong_content.gb', { force: true });
    cy.get('li#source-1 .MuiAlert-message').contains('Pydna parser reader cannot process this file.');
  });
});
