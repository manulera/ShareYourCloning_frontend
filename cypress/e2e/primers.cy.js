describe('Tests primer functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('button.MuiTab-root').contains('Primers').click();
  });
  it('Can delete primers', () => {
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').should('have.length', 2);
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').first().click();
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').should('have.length', 1);
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').first().click();
    cy.get('.primer-table-container [data-testid="DeleteIcon"]').should('not.exist');
  });
  it('Can add primers', () => {
    // Add two dummy primers
    cy.get('.primer-form-container').contains('Add Primer').click();
    cy.get('form.primer-row').should('exist');
    cy.get('form.primer-row input#name').type('fwd-2');
    cy.get('form.primer-row input#sequence').type('atg');
    cy.get('form.primer-row [data-testid="CheckCircleIcon"]').click();
    cy.get('form.primer-row').should('not.exist');
    cy.get('.primer-form-container').contains('Add Primer').should('exist');
    cy.get('.primer-table-container tr').contains('fwd-2').should('exist');
    cy.get('.primer-table-container tr').contains('atg').should('exist');
  });
  it('Can close add form', () => {
    // Add two dummy primers
    cy.get('.primer-form-container').contains('Add Primer').click();
    cy.get('form.primer-row').should('exist');
    cy.get('.primer-form-container [data-testid="CancelIcon"').click();
    cy.get('form.primer-row').should('not.exist');
    cy.get('.primer-form-container').contains('Add Primer').click();
    // Type something and close
    cy.get('form.primer-row input#name').type('fwd-2');
    cy.get('form.primer-row input#sequence').type('atg');
    cy.get('.primer-form-container [data-testid="CancelIcon"').click();
    cy.get('form.primer-row').should('not.exist');
  });
  it('Can edit primers', () => {
    cy.get('.primer-table-container [data-testid="EditIcon"]').first().click();
    cy.get('form.primer-row').should('exist');
    cy.get('form.primer-row input#name').should('have.value', 'fwd');
    cy.get('form.primer-row input#sequence').should('have.value', 'gatctcgccataaaagacag');
    cy.get('form.primer-row input#name').clear();
    cy.get('form.primer-row input#name').type('blah');
    cy.get('form.primer-row input#sequence').clear();
    cy.get('form.primer-row input#sequence').type('gggggggggggg');
    cy.get('form.primer-row [data-testid="CheckCircleIcon"]').click();
    cy.get('form.primer-row').should('not.exist');
    cy.get('.primer-form-container').contains('Add Primer').should('exist');
    cy.get('.primer-table-container tr').contains('blah').should('exist');
    cy.get('.primer-table-container tr').contains('gggggggggggg').should('exist');
    cy.get('.primer-table-container tr').contains('fwd').should('not.exist');
    cy.get('.primer-table-container tr').contains('gatctcgccataaaagacag').should('not.exist');
  });
  it('Applies contrains to edit primer');
  it('Applies constrains to new primer', () => {
    // Useful to check the form is not submitted
    const formNotSubmittable = () => {
      cy.get('form.primer-row [data-testid="CheckCircleIcon"]').should('have.class', 'form-invalid');
      cy.get('form.primer-row [data-testid="CheckCircleIcon"]').click();
      cy.get('form.primer-row').should('exist');
    };

    cy.get('form.primer-row').should('not.exist');
    cy.get('.primer-form-container').contains('Add Primer').click();
    // The button is no longer shown after clicking
    cy.get('.primer-form-container').contains('Add Primer').should('not.exist');
    // The form is shown, but can't be submitted yet
    cy.get('form.primer-row').should('exist');
    // Should have empty helper text
    cy.get('form.primer-row .MuiFormHelperText-root').should('have.text', '');
    formNotSubmittable();
    // The form is still shown
    cy.get('form.primer-row .MuiFormHelperText-root#name-helper-text').contains('Field required');
    cy.get('form.primer-row .MuiFormHelperText-root#sequence-helper-text').contains('Field required');

    // Type existing name
    cy.get('form.primer-row input#name').type('fwd');
    cy.get('form.primer-row .MuiFormHelperText-root#name-helper-text').contains('Name exists');
    formNotSubmittable();
    cy.get('form.primer-row input#name').clear('');
    cy.get('form.primer-row .MuiFormHelperText-root#name-helper-text').should('have.text', 'Field required');
    cy.get('form.primer-row input#name').type('fwd-2');
    cy.get('form.primer-row .MuiFormHelperText-root#name-helper-text').should('have.text', '');
    formNotSubmittable();

    // Type non-DNA sequence
    cy.get('form.primer-row input#sequence').type('yy');
    cy.get('form.primer-row .MuiFormHelperText-root#sequence-helper-text').contains('Invalid DNA sequence');
    formNotSubmittable();
    cy.get('form.primer-row input#sequence').clear('');
    cy.get('form.primer-row .MuiFormHelperText-root#sequence-helper-text').should('have.text', 'Field required');
    cy.get('form.primer-row input#sequence').type('atg');
    cy.get('form.primer-row .MuiFormHelperText-root#sequence-helper-text').should('have.text', '');
    cy.get('form.primer-row [data-testid="CheckCircleIcon"]').should('not.have.class', 'form-invalid');
    cy.get('form.primer-row [data-testid="CheckCircleIcon"]').click();
    cy.get('form.primer-row').should('not.exist');
  });
});
