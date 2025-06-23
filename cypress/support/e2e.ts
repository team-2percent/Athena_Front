// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// 전역 테스트 격리 설정
beforeEach(() => {
  // 모든 인터셉트 정리
  cy.clearIntercepts()
  
  // 공통 인터셉트 설정
  cy.setupCommonIntercepts()
  
  // 로컬 스토리지 및 세션 스토리지 정리
  cy.clearLocalStorage()
  cy.clearCookies()
})

afterEach(() => {
  // 테스트 후 인터셉트 정리
  cy.clearIntercepts()
})