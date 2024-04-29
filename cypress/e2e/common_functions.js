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

export function addSource(sourceType, isFirst = false) {
  if (!isFirst) {
    cy.get('svg[data-testid="AddCircleIcon"]').first().click();
  }
  cy.get('#tab-panel-0 .select-source h2').contains('Define a sequence source').siblings('div').children('.MuiInputBase-root')
    .click();
  cy.get(`li[data-value="${sourceType}"]`).click();
}

export function clearPrimers() {
  // click on [data-testid="DeleteIcon"] until there are no more
  cy.get('.primer-table-container [data-testid="DeleteIcon"]').each((el) => {
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').first().click();
  });
}

export function addPrimer(seq, name) {
  cy.get('.primer-form-container').contains('Add Primer').click();
  cy.get('form.primer-row input#name').type(name);
  cy.get('form.primer-row input#sequence').type(seq);
  cy.get('form.primer-row [data-testid="CheckCircleIcon"]').click();
}

export function clickMultiSelectOption(label, option, parentSelector = '') {
  cy.get(parentSelector).contains(label).siblings('div').first()
    .click();
  cy.get('div[role="presentation"]').contains(option).click();
}

export function setInputValue(label, value, parentSelector = '') {
  cy.get(parentSelector).contains(label).siblings('div').first()
    .children('input')
    .clear('');
  cy.get(parentSelector).contains(label).siblings('div').first()
    .children('input')
    .type(value);
}

export function checkInputValue(label, value, parentSelector = '') {
  cy.get(parentSelector).contains(label).siblings('div').first()
    .children('input')
    .should('have.value', value);
}
