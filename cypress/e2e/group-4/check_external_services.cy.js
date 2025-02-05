import { addSource, clickMultiSelectOption } from '../common_functions';

describe('Test delete source functionality', () => {
  it('Gives the right error if the backend server is down or if there are known errors', () => {
    cy.intercept('GET', 'http://127.0.0.1:8000/', {
      statusCode: 500,
    }).as('localCheck');
    // Check if known errors are displayed
    cy.intercept('GET', 'http://localhost:3000/known_errors.json', {
      statusCode: 200,
      body: {
        ManuallyTypedSource: ['hello1', 'hello2'],
      },
    }).as('knownErrors');
    cy.visit('/');

    cy.get('.service-status-check-alert').should('contain', 'Backend server is down');
    cy.intercept('GET', 'http://127.0.0.1:8000/', {
      statusCode: 200,
    }).as('localCheck2');
    cy.get('.service-status-check-alert button').click();
    cy.get('.service-status-check-alert').should('contain', 'All services are up and running!');
    cy.get('.service-status-check-alert button').click();
    cy.get('.service-status-check-alert').should('not.exist');

    // Check if known errors are displayed
    addSource('ManuallyTypedSource', true);
    cy.get('.open-cloning li#source-1').contains('Affected by external errors');
    cy.get('.open-cloning li#source-1 button').contains('See how').click();
    cy.get('.MuiDialog-container li').contains('hello1');
    cy.get('.MuiDialog-container li').contains('hello2');
    cy.get('.MuiDialog-container button').contains('Close').click();

    // Change to a different type of source
    clickMultiSelectOption('Source type', 'Repository ID', '.open-cloning');
    cy.get('.open-cloning li#source-1').contains('Affected by external errors').should('not.exist');
  });
});
