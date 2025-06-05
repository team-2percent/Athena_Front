/// <reference types="cypress" />

import { jwtDecode } from "jwt-decode";

Cypress.Commands.add('login', () => {
    // 로그인 API 호출 인터셉트
    cy.intercept({
        method: "POST",
        url: "/api/user/login"
    }, {
        statusCode: 200,
        body: {
            accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6IuqwgOyehe2FjOyKpO2KuCIsImlhdCI6MTc0ODk2ODQ0MSwiZXhwIjoxNzQ5NTczMjQxfQ.8QkpyGU8Mf9Mh2xSTzlmHCapyxQZONR81ZHcv_GQ2b4",
            userId: "57"
        }
    }).as('login')

    // FCM 등록 인터셉트
    cy.intercept({
        method: "POST",
        url: "/api/fcm/register"
    }, {
        statusCode: 200,
    })
    // 로그인 모달 열기
    cy.get('header').get('[data-cy="open-login-modal-button"]').click()
    
    // 로그인 폼 작성
    cy.get('[data-cy="login-modal"]').within(() => {
        cy.get('[data-cy="email-input"]').type("test@test.com")
        cy.get('[data-cy="password-input"]').type("Abc1234%")
        cy.get('[data-cy="login-button"]').should('not.be.disabled').click()
    })

    // 토큰 저장
    cy.wait('@login').then(() => {
      cy.window().then((win: Window) => {
        win.localStorage.setItem('accessToken', "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6IuqwgOyehe2FjOyKpO2KuCIsImlhdCI6MTc0ODk2ODQ0MSwiZXhwIjoxNzQ5NTczMjQxfQ.8QkpyGU8Mf9Mh2xSTzlmHCapyxQZONR81ZHcv_GQ2b4");
        win.localStorage.setItem('userId', "57");
      });
    })
  
    // 페이지 새로고침
    cy.reload()
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
    cy.visit('/', {
      onBeforeLoad(win: any) {
        // window 객체에 있는 isSupported를 stub
        // 보통은 앱 번들 안에서 import 된 모듈이라 직접 접근은 어려움
        // 그래서 messaging 객체 자체를 shim 처리
        win.firebase = {
          messaging: () => ({
            isSupported: () => Promise.resolve(false), // ✅ 핵심: FCM 전체 비활성화
          }),
        };
  
        // 또는 메시징 관련 예외가 터지지 않도록 기본 메서드 stub
        cy.stub(win.Notification, 'requestPermission').resolves('granted');
      },
    });
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