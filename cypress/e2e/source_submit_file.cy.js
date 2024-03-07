describe('File Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="file"]').click();
  });
  it('works on normal case', () => {
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    //  This does not really test that clicking the button opens the file interface, but I did not see how
    cy.get('.MuiButtonBase-root > input').selectFile('public/examples/ase1.gb', { force: true });
    cy.get('[style="text-align: center;"] > :nth-child(1)').should('have.text', 'CU329670 ');
  });
});
