import { addLane, addSource, clearPrimers, clickMultiSelectOption, skipGoogleSheetErrors, skipNcbiCheck } from './common_functions';

describe('File Source', () => {
  beforeEach(() => {
    cy.visit('/');
    // Intercepts must be in this order
    skipGoogleSheetErrors();
    skipNcbiCheck();
    addSource('UploadedFileSource', 1);
  });
  it('works on normal case', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('public/examples/ase1.gb', { force: true });
    cy.get('li#sequence-2', { timeout: 20000 }).contains('CU329670');
    cy.get('li#sequence-2 li#source-1').contains('Read from uploaded file ase1.gb');
  });
  it('gives the right error when file has a wrong extension', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('cypress/test_files/wrong_extension.txt', { force: true });
    cy.get('li#source-1 .MuiAlert-message').contains('We could not guess the format');
  });
  it('gives the right error when file has a wrong content', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('cypress/test_files/wrong_content.gb', { force: true });
    cy.get('li#source-1 .MuiAlert-message').contains('Biopython cannot process');
  });
  it('gives the right error when circularize is checked and file is not fasta', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('li#source-1').contains('Circularize').click();
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('public/examples/ase1.gb', { force: true });
    cy.get('li#source-1 .MuiAlert-message').contains('is only supported');
  });
  it('works when circularize is checked and file is fasta', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('li#source-1').contains('Circularize').click();
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('public/examples/dummy_multi_fasta.fasta', { force: true });
    cy.get('li#source-1 .MuiAlert-message').should('not.exist');
  });
  it('allows to specify input format', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    clickMultiSelectOption('File format', 'FASTA', 'li#source-1');
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('public/examples/fasta_file_with_gb_extension.gb', { force: true });
    cy.get('li#source-1', { timeout: 20000 }).contains('Choose product');
  });
  it('works when loading a history file', () => {
    clearPrimers();
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('li#source-1 form.submit-sequence-file input').eq(2).selectFile('public/examples/golden_gate.json', { force: true });
    cy.get('li', { timeout: 20000 }).contains('Restriction with BsaI');
    // You can load another history file on top
    addLane();
    addSource('UploadedFileSource', true);
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get('form.submit-sequence-file input').eq(2).selectFile('public/examples/gibson_assembly.json', { force: true });
    cy.get('li', { timeout: 20000 }).contains('Restriction with BsaI');
    cy.get('li').contains('Gibson');
  });
});
