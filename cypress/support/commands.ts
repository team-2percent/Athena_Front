/// <reference types="cypress" />

import { jwtDecode } from "jwt-decode";

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.request('POST', '/api/user/login', {
      email,
      password,
    }).then((res) => {
        const { accessToken, userId } = res.body;
        const { role } = jwtDecode<{ role: string }>(accessToken);
    
        cy.window().then((win) => {
          win.localStorage.setItem('accessToken', accessToken);
          win.localStorage.setItem('userId', userId.toString());
        });

        cy.reload(); // zustand에서 인식
    });
})

Cypress.Commands.add('visitMainPage', () => {
    cy.intercept({
      method: 'GET',
      url: '/api/project/planRankingView'
    }, {
      fixture: 'planRankingView.json'
    }).as('getPlanRankingView')

    cy.intercept({
      method: "GET",
      url: '/api/project/categoryRankingView'
    }, {
      fixture: 'categoryRankingView.json'
    }).as('getCategoryRankingView')

    cy.visit('/')
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      visitMainPage(): Chainable<void>
    //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}