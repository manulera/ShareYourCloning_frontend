describe('Test delete source functionality', () => {
  it('Gives the right error if the backend server is down', () => {
    cy.visit('/');
    cy.intercept('GET', 'http://127.0.0.1:8000/', {
      statusCode: 500,
    }).as('localCheck');
    cy.intercept('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&retmode=json&id=22258761', {
      statusCode: 200,
      body: {
        result: {
          22258761: {
            assemblyaccession: 'GCF_000002945.1',
          },
        },
      },
    }).as('ncbiCheck');

    cy.get('.service-status-check-alert').should('contain', 'Backend server is down');
    cy.intercept('GET', 'http://127.0.0.1:8000/', {
      statusCode: 200,
    }).as('localCheck2');
    cy.get('.service-status-check-alert button').click();
    cy.get('.service-status-check-alert').should('contain', 'All services are up and running!');
    cy.get('.service-status-check-alert button').click();
    cy.get('.service-status-check-alert').should('not.exist');
  });
  it('Gives the right error if ncbi is down', () => {
    cy.visit('/');
    cy.intercept('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&retmode=json&id=22258761', {
      statusCode: 503,
    }).as('ncbiCheck');

    cy.get('.service-status-check-alert').should('contain', 'NCBI server is down');
    cy.intercept('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&retmode=json&id=22258761', {
      statusCode: 503,
    }).as('ncbiCheck2');
    cy.intercept('GET', 'http://127.0.0.1:8000/', {
      statusCode: 500,
    }).as('localCheck');
    cy.get('.service-status-check-alert button').click();
    cy.get('.service-status-check-alert').should('contain', 'Backend server is down');
    cy.get('.service-status-check-alert').should('contain', 'NCBI server is down');
  });
});
