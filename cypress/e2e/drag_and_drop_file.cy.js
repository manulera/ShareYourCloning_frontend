describe('Test drag and drop functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('li#source-1').should('exist');
  });
  it('Shows the drop area when dragging a file', () => {
    cy.get('div.cloning-history').trigger('dragover');
    cy.get('div.cloning-history').should('have.class', 'dragging-file');
    cy.get('div.cloning-history').contains('Drop multiple sequence').should('exist');
    cy.get('div.cloning-history').trigger('dragleave');
    cy.get('div.cloning-history').should('not.have.class', 'dragging-file');

    // Also can be closed
    cy.get('div.cloning-history').trigger('dragover');
    cy.get('div.cloning-history').should('have.class', 'dragging-file');
    cy.get('div.cloning-history').contains('Drop multiple sequence').should('exist');
    cy.get('div.cloning-history .cancel-icon').click();
    cy.get('div.cloning-history').should('not.have.class', 'dragging-file');
  });
  it('Can load single sequence file', () => {
    cy.get('div.cloning-history').selectFile('public/examples/ase1.gb', { action: 'drag-drop' });
    // This also checks that the empty source was replaced
    cy.get('li#sequence-2', { timeout: 20000 }).contains('CU329670');
    cy.get('li#sequence-2 li#source-1').contains('Read from uploaded file ase1.gb');
  });
  it('Can load multiple sequence files, with multiple sequences in them', () => {
    cy.get('div.cloning-history').selectFile(['public/examples/ase1.gb', 'public/examples/dummy_multi_fasta.fasta'], { action: 'drag-drop' });
    // There should be three sources displayed, and three sequences (7 because of the Add Source button)
    cy.get('div.tf-tree.tf-ancestor-tree ul li').should('have.length', 7);
  });
  it('Can load a history file', () => {
    cy.get('div.cloning-history').selectFile('public/examples/homologous_recombination.json', { action: 'drag-drop' });
    // No error message should be displayed
    cy.get('div.MuiAlert-message').should('not.exist');
    cy.get('div.tf-tree.tf-ancestor-tree').contains('Homologous recombination with').should('exist');
  });
  it('Shows the right errors when dropping wrong files', () => {
    // JSON file + something else
    cy.get('div.cloning-history').selectFile(['public/examples/homologous_recombination.json', 'public/examples/ase1.gb'], { action: 'drag-drop' });
    cy.get('div.MuiAlert-message').contains('Drop either a single JSON file or multiple sequence files. Not both.');

    // JSON file with wrong content
    cy.get('div.cloning-history').selectFile('public/examples/wrong_history.json', { action: 'drag-drop' });
    cy.get('div.MuiAlert-message').contains('JSON file in wrong format');

    // Files which are not sequences
    cy.get('div.cloning-history').selectFile('public/favicon.ico', { action: 'drag-drop' });
    cy.get('div.MuiAlert-message').contains('Could not read the file favicon.ico');

    // Files which are not sequences mixed with sequences
    cy.get('div.cloning-history').selectFile(['public/examples/ase1.gb', 'public/favicon.ico'], { action: 'drag-drop' });
    cy.get('div.MuiAlert-message').contains('Could not read the file favicon.ico');
  });
});
