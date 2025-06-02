describe('Cypress 테스트', () => {
  it('헤더 내 로고 클릭하면 메인 페이지로 이동', () => {
    cy.visit('/project/78')
    cy.get('header').find('a').click()
    cy.url().should('include', '/')
  })

  it('헤더 내 로그인 클릭하면 로그인 모달창 오픈, 입력해서 로그인', () => {
    cy.visit('/')

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

    // intercept를 사용할 경우 새로고침은 제대로 동작하지 않으므로 사용하지 않음

    cy.get('header').get('[data-cy="open-login-modal-button"]').should('be.visible').click()
    cy.get('header').get('[data-cy="login-modal"]').should('be.visible')

    cy.get('[data-cy="login-modal"]').as('loginModal')
    cy.get('@loginModal').get('[data-cy="login-button"]').should('be.disabled')
    cy.get('@loginModal').get('[data-cy="email-input"]').type('gaip@test.com')
    cy.get('@loginModal').get('[data-cy="password-input"]').type('Abc1234%')
    cy.get('@loginModal').get('[data-cy="login-button"]').should('not.be.disabled')

    cy.get('@loginModal').get('[data-cy="login-button"]').click()

    cy.get('[data-cy="login-modal"]').should('not.exist')
  })
})