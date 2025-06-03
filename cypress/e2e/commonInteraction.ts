describe('공통 상호작용', () => {
    it('헤더 내 로고 클릭하면 메인 페이지로 이동', () => {
      cy.visit('/project/78')
      cy.get('header').find('a').click()
      cy.url().should('include', '/')
    })
})