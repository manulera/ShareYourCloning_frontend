export function addSource(sourceType, isFirst = false) {
  if (!isFirst) {
    cy.get('svg[data-testid="AddCircleIcon"]').first().click();
  }
  cy.get('#tab-panel-0 .select-source h2').contains('Define a sequence source').siblings('div').children('.MuiInputBase-root')
    .click();
  cy.get(`li[data-value="${sourceType}"]`).click();
}

export function addLane() {
  cy.get('svg[data-testid="AddCircleIcon"]').last().click();
}

export function clearPrimers() {
  // click on [data-testid="DeleteIcon"] until there are no more
  cy.get('button.MuiTab-root').contains('Primers').click();
  cy.get('.primer-table-container [data-testid="DeleteIcon"]').each((el) => {
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').first().click();
  });
  cy.get('button.MuiTab-root').contains('Cloning').click();
}

export function addPrimer(name, seq) {
  cy.get('button.MuiTab-root').contains('Primers').click();
  cy.get('.primer-form-container').contains('Add Primer').click();
  cy.get('form.primer-row input#name').type(name, { delay: 0 });
  cy.get('form.primer-row input#sequence').type(seq, { delay: 0 });
  cy.get('form.primer-row [data-testid="CheckCircleIcon"]').click();
  cy.get('button.MuiTab-root').contains('Cloning').click();
}

export function clickMultiSelectOption(label, option, parentSelector = '') {
  cy.get(parentSelector).contains(label).siblings('div').first()
    .click();
  cy.get('div[role="presentation"]').contains(option).click();
  // Click outside
  cy.get('body').click(0, 0);
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

export function clickSequenceOutputArrow(parentSelector, isRight = true) {
  cy.get(`${parentSelector} .multiple-output-selector [data-testid="ForwardIcon"]`).eq(1).click();
}

export function loadHistory(filePath) {
  cy.get('.MuiToolbar-root .MuiButtonBase-root').contains('File').siblings('input').selectFile(filePath, { force: true });
}

export function deleteSource(id) {
  cy.get(`#source-${id} [data-testid="DeleteIcon"]`).first().click();
}

export function manuallyTypeSequence(seq, circular = false, overhangs = []) {
  cy.get('#tab-panel-0 .select-source h2').last().closest('.source-node').invoke('attr', 'id')
    .then((sourceId) => {
      cy.get('#tab-panel-0 .select-source h2').last().contains('Define a sequence source').siblings('div')
        .children('.MuiInputBase-root')
        .click();
      cy.get('li[data-value="ManuallyTypedSource"]').click();
      cy.get('#tab-panel-0 #sequence').clear('');
      cy.get('#tab-panel-0 #sequence').type(seq);
      if (circular) {
        cy.get('#tab-panel-0 span').contains('Circular DNA').click();
      }
      if (overhangs.length > 0) {
        const [left, right] = overhangs;
        setInputValue('Overhang crick 3\'', `${left}`, '#tab-panel-0');
        setInputValue('Overhang watson 3\'', `${right}`, '#tab-panel-0');
      }
      cy.get('.select-source > form > .MuiButtonBase-root').click();

      cy.get(`.sequence-node #${sourceId}`, { timeout: 20000 }).should('exist');
    });
}
