import 'cypress-keycloak';

const user = {
  id: 1,
  firstname: 'Brazier',
  lastname: 'Arnaud',
  email: 'abrazier@okteo.fr',
};

function beforeBackend() {
  cy.visit('/');
  cy.get('#username') // The username field on the keycloak login page
    .type('braziera01d')
    .get('#password')
    .type('azerty');
  cy.get('#kc-login').click();
  //cy.wait(300);
  /*cy.login({
    root: 'https://ssodev.okteo.fr',
    realm: 'Okteo',
    username: 'braziera01d',
    password: 'azerty',
    client_id: 'template',
    redirect_uri: 'http://localhost:5050/'
  });*/
}

function startBackend() {
  cy.intercept('GET', 'api/users', [
    user,
    {
      id: 1,
      firstname: 'Gimaret',
      lastname: 'Florent',
      email: 'fgimaret@okteo.fr',
    },
  ]).as('getUsers');
}

function afterBackend() {
  cy.logout({
    root: 'https://ssodev.okteo.fr',
    realm: 'Okteo',
    redirect_uri: 'http://localhost:5050/',
  });
}

describe('Users', () => {
  beforeEach(() => startBackend());
  before(() => beforeBackend());
  after(() => afterBackend());

  it('should display a user list', () => {
    // loading
    cy.contains('div', 'Loading...');
    cy.wait('@getUsers');
    cy.get('h2').should('have.length', 2);
    cy.get('h3.email').should('have.length', 2).and('contain', '.fr');
    cy.get('.p-message-error').should('not.exist');
  });
  it('should display a loading error', () => {
    // override the response to have an error
    cy.intercept('GET', 'api/users', {
      statusCode: 404,
      delay: 500,
    }).as('getUsersError');
    cy.visit('/');
    // loading
    cy.contains('div', 'Loading...');
    cy.wait('@getUsersError');
    cy.contains('.p-message-error', 'An error occurred while loading');
  });
});
