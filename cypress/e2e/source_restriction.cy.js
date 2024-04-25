describe('Test restriction component', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Works in normal case', () => {
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="manually_typed"]').click();
    cy.get('#tab-panel-0 #sequence').clear('');
    cy.get('#tab-panel-0 #sequence').type('aagaattcaaaagaattcaa');
    cy.get('.select-source > form > .MuiButtonBase-root', { timeout: 20000 }).click();
    cy.get('svg[data-testid="AddCircleIcon"]').first().click();
    cy.get('li#source-3 .MuiInputBase-root').eq(0).click();
    cy.get('li[data-value="restriction"]').click();

    // Click the selector
    cy.get('li#source-3 .MuiInputBase-root').eq(1).click();
    // All enzymes shown
    cy.get('div[role="presentation"]', { timeout: 20000 }).contains('AanI');
    // Type EcoRI
    cy.get('label').contains('Enzymes used').siblings('div').children('input')
      .type('EcoRI');
    cy.get('div[role="presentation"]').contains('AanI').should('not.exist');
    cy.get('div[role="presentation"]').contains('EcoRI');
    // Select the option
    cy.get('div[role="presentation"]').contains('EcoRI').click();
    // Select SalI
    cy.get('label').contains('Enzymes used').siblings('div').children('input')
      .clear('')
      .type('SalI');
    cy.get('div[role="presentation"]').contains('SalI').click();
    // There should be two chips
    cy.get('.MuiChip-root').contains('EcoRI');
    cy.get('.MuiChip-root').contains('SalI');
    // We can remove SalI
    cy.get('.MuiChip-root').contains('SalI').siblings('svg').click();
    cy.get('.MuiChip-root').contains('SalI').should('not.exist');
    cy.get('.MuiChip-root').contains('EcoRI');
    // Cut with EcoRI
    cy.get('button').contains('Perform restriction').click();
    // Contains both the parent with the subset, and the child with the result
    cy.get('li#source-3').contains('20 bps');
    cy.get('li#source-3').contains('7 bps');
    cy.get('li#source-3 .overhang-representation').contains('ttcttaa');
    // The subset is shown
    cy.get('li#source-3 .multiple-output-selector .veSelectionLayer').should('exist');
    cy.get('li#source-3 .multiple-output-selector [title="Selecting 8 bps from 1 to 8"]');
    // Clicking on the buttons should change the selection (we move back)
    cy.get('li#source-3 .multiple-output-selector [data-testid="ForwardIcon"]').first().click();
    cy.get('li#source-3 .overhang-representation').contains('ttcttaa').should('not.exist');
    cy.get('li#source-3 .overhang-representation').contains('aattcaa');
    // We select the central fragment
    cy.get('li#source-3 .multiple-output-selector [data-testid="ForwardIcon"]').first().click();
    cy.get('li#source-3 .overhang-representation').contains('aattcaaaag');
    cy.get('li#source-3 .overhang-representation').contains('gttttcttaa');
    cy.get('button').contains('Choose fragment').click();
    // The result is shown
    cy.get('li#sequence-4', { timeout: 20000 }).contains('14 bps');
  });
});
