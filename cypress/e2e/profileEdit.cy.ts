describe('프로필 수정 페이지', () => {
  beforeEach(() => {
    cy.fixture('profileEdit/user.json').then((profileEdit) => {
      cy.intercept({
        method: 'GET',
        url: '/api/user/*'
      }, {
        statusCode: 200,
        body: profileEdit
      }).as("getUser");
    })

    cy.fixture('userHeader.json').then((userHeader) => {
        cy.intercept({
            method: "GET",
            url: "/api/user/Header"
        }, {
            statusCode: 200,
            body: userHeader
        }).as("getUserHeader");
    })

    cy.fixture('profileEdit/accountList.json').then((account) => {
        cy.intercept({
            method: "GET",
            url: "/api/my/bankAccount"
        }, {
            statusCode: 200,
            body: account
        }).as("getAccount");
    })

    cy.fixture('profileEdit/addressList.json').then((shipping) => {
        cy.intercept({
            method: "GET",
            url: "/api/my/delivery-info"
        }, {
            statusCode: 200,
            body: shipping
        }).as("getAddress");
    })

    cy.visitMainPage()
    cy.adminLogin()
    cy.visit('/my/edit')
  })

  describe('공통', () => {
    it('프로필 페이지로 돌아가기', () => {
      cy.get('[data-cy="back-button"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/my')
    })

    it('메뉴 탭', () => {
      // 탭 존재 확인
      cy.get('[data-cy="menu-tab-프로필"]').should('be.visible')
      cy.get('[data-cy="menu-tab-계좌"]').should('be.visible')
      cy.get('[data-cy="menu-tab-배송지"]').should('be.visible')
      cy.get('[data-cy="menu-tab-탈퇴하기"]').should('be.visible')

      // 소개 탭 활성화 상태 확인
      cy.get('[data-cy="menu-tab-프로필"]').should('have.class', 'text-main-color')
    })
  })

  describe('탈퇴하기', () => {
    it('탈퇴하기 접근', () => {
      cy.get('[data-cy="menu-tab-탈퇴하기"]').click()
      cy.get('[data-cy="menu-tab-탈퇴하기"]').should('have.class', 'text-main-color')
      cy.get('[data-cy="withdraw-button"]').should('be.visible')
    })
  })
})
