// async function responseGenerator(req) {
//   if (req.body.repository_id === '39282') {
//     req.reply({ statusCode: 200, fixture: 'repository_id/addgene_correct/response_body.json' });
//   } else if (req.body.repository_id === 'NM_001018957.2') {
//     req.reply({ statusCode: 200, fixture: 'repository_id/ncbi_correct/response_body.json' });
//   } else if (req.body.repository === 'addgene') {
//     req.reply({ statusCode: 404, fixture: 'repository_id/addgene_wrong/response_body.json' });
//   } else if (req.body.repository === 'genbank') {
//     req.reply({ statusCode: 404, fixture: 'repository_id/ncbi_wrong/response_body.json' });
//   }
// }

describe('RepositoryId Source', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#tab-panel-0 .MuiInputBase-root').click();
    cy.get('li[data-value="repository_id"]').click();
    // cy.intercept('POST', '**/repository_id', (req) => responseGenerator(req)).as('repositoryId');
  });
  it('works with normal case', () => {
    cy.get('body').click();
    cy.get('[aria-labelledby="select-repository-1-label"]').click();
    cy.get('li[data-value="addgene"]').click();
    cy.get('#repository-id-1').clear('3');
    cy.get('#repository-id-1').type('39282');
    cy.get('.select-source > form > .MuiButtonBase-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .node-text > .corner-id').should('have.text', '2');
  });
});
