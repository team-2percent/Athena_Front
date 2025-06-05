/// <reference types="cypress" />

import { jwtDecode } from "jwt-decode";

Cypress.Commands.add('login', () => {
    cy.intercept({
      method: "POST",
      url: "/api/fcm/register"
    })

    cy.window().then((win: Window) => {
        win.localStorage.setItem('accessToken', "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6IuqwgOyehe2FjOyKpO2KuCIsImlhdCI6MTc0ODk2ODQ0MSwiZXhwIjoxNzQ5NTczMjQxfQ.8QkpyGU8Mf9Mh2xSTzlmHCapyxQZONR81ZHcv_GQ2b4");
        win.localStorage.setItem('userId', "57");
    });

    cy.reload(); // zustand에서 인식
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
      login(): Chainable<void>
      visitMainPage(): Chainable<void>
    //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}