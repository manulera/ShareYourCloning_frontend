export function manuallyTypeSequence(seq, circular = false) {
  cy.get('#tab-panel-0 .select-source h2').contains('Define a sequence source').siblings('div').children('.MuiInputBase-root')
    .click();
  cy.get('li[data-value="manually_typed"]').click();
  cy.get('#tab-panel-0 #sequence').clear('');
  cy.get('#tab-panel-0 #sequence').type(seq);
  if (circular) {
    cy.get('#tab-panel-0 span').contains('Circular DNA').click();
  }
  cy.get('.select-source > form > .MuiButtonBase-root').click();
}

export function addSource(sourceType) {
  cy.get('svg[data-testid="AddCircleIcon"]').first().click();
  cy.get('#tab-panel-0 .select-source h2').contains('Define a sequence source').siblings('div').children('.MuiInputBase-root')
    .click();
  cy.get(`li[data-value="${sourceType}"]`).click();
}
