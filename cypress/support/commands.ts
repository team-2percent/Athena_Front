/// <reference types="cypress" />

import { jwtDecode } from "jwt-decode";

let userHeaderFixture: any

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

    cy.intercept({
      method: "GET",
      url: "/api/user/Header"
    }, {
      statusCode: 200,
      body: {
        nickname: "테스트유저",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      }
    }).as('getHeader')

    // FCM 등록 인터셉트
    cy.intercept({
        method: "POST",
        url: "/api/fcm/register"
    }, {
        statusCode: 200,
    }).as('fcmRegister')
    // 로그인 모달 열기
    cy.get('header').get('[data-cy="open-login-modal-button"]').click()

    cy.get('[data-cy="login-modal"]').should('be.visible')
    
    // 로그인 폼 작성
    cy.get('[data-cy="login-modal"]').within(() => {
        cy.get('[data-cy="email-input"]').type("test@test.com")
        cy.get('[data-cy="password-input"]').type("Abc1234%")
        cy.get('[data-cy="login-button"]').should('not.be.disabled').click()
    })

    cy.wait('@login').its('response.statusCode').should('eq', 200)
    cy.wait('@getHeader').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('adminLogin', () => {
  cy.intercept({
      method: "POST",
      url: "/api/user/login"
  }, {
      statusCode: 200,
      body: {
          accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX0FETUlOIiwibmlja25hbWUiOiLqsIDsnoXthYzsiqTtirgiLCJpYXQiOjE3NDg5Njg0NDEsImV4cCI6MTc0OTU3MzI0MX0.2ilTPbIisw2OREhlLLf20N9e9Daop8lfOEGP_s5xKh0",
          userId: "57"
      }
  }).as('adminLogin')

  cy.intercept({
    method: "GET",
    url: "/api/user/Header"
  }, {
    statusCode: 200,
    body: {
      nickname: "테스트유저",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    }
  }).as('getHeader')

  // FCM 등록 인터셉트
  cy.intercept({
      method: "POST",
      url: "/api/fcm/register"
  }, {
      statusCode: 200,
  }).as('fcmRegister')
  // 로그인 모달 열기
  cy.get('header').get('[data-cy="open-login-modal-button"]').click()

  // 로그인 폼 작성
  cy.get('[data-cy="login-modal"]').within(() => {
      cy.get('[data-cy="email-input"]').type("test@test.com")
      cy.get('[data-cy="password-input"]').type("Abc1234%")
      cy.get('[data-cy="login-button"]').should('not.be.disabled').click()
  })

  cy.wait('@adminLogin').its('response.statusCode').should('eq', 200)
  cy.wait('@getHeader').its('response.statusCode').should('eq', 200)
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
      // Firebase를 동기적으로 초기화
      win.firebase = {
        messaging: () => ({
          isSupported: () => false, // Promise 제거하여 동기 처리
          getToken: () => Promise.resolve('mock-token'),
          onMessage: () => {},
          onBackgroundMessage: () => {},
        }),
        app: () => ({
          name: 'test-app',
          options: {},
        }),
      };

      // Notification API도 동기적으로 처리
      win.Notification = {
        requestPermission: () => Promise.resolve('granted'),
        permission: 'granted',
      };
    },
  });

  cy.get('body').should('be.visible')
  cy.wait('@getPlanRankingView').its('response.statusCode').should('eq', 200)
  cy.wait('@getCategoryRankingView').its('response.statusCode').should('eq', 200)
})
Cypress.Commands.add('checkErrorTopToast', (title: string, body: string) => {
    cy.get('[data-cy="error-top-toast"]').should('be.visible').within(() => {
        cy.get('[data-cy="top-toast-title"]').should('contain', title)
        cy.get('[data-cy="top-toast-body"]').should('contain', body)
    }).as("errorTopToast")

    cy.get('[data-cy="top-toast-close-button"]').click().then(() => {
        cy.get("@errorTopToast").should('not.exist')
    })
})

Cypress.Commands.add('checkServerErrorCard', (message: string) => {
  cy.get('[data-cy="server-error-card"]').should('be.visible')
  cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', message)
  cy.get('[data-cy="retry-button"]').should('be.visible')
})

Cypress.Commands.add('checkEmptyMessageCard', (message: string) => {
  cy.get('[data-cy="empty-message-card"]').should('be.visible')
  cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', message)
})

// 테스트 간 격리를 위한 인터셉트 정리 함수
Cypress.Commands.add('clearIntercepts', () => {
  // 모든 인터셉트를 제거
  cy.intercept('*', (req) => {
    // 기본 동작 (인터셉트 없음)
  }).as('clearAll');
});

// 공통 API 인터셉트 설정 함수
Cypress.Commands.add('setupCommonIntercepts', () => {
  // 로그인 관련 기본 인터셉트
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 1,
        email: 'test@example.com',
        nickname: '테스트유저'
      }
    }
  }).as('login');

  // 사용자 정보 관련 기본 인터셉트
  cy.intercept('GET', '/api/user', {
    statusCode: 200,
    body: {
      id: 1,
      email: 'test@example.com',
      nickname: '테스트유저'
    }
  }).as('getUserInfo');
});

// TypeScript 타입 정의
declare global {
  namespace Cypress {
    interface Chainable {
      clearIntercepts(): Chainable<void>
      setupCommonIntercepts(): Chainable<void>
    }
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      adminLogin(): Chainable<void>
      visitMainPage(): Chainable<void>
      checkErrorTopToast(title: string, body: string): Chainable<void>
      checkServerErrorCard(message: string): Chainable<void>
      checkEmptyMessageCard(message: string): Chainable<void>
    //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}