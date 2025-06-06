describe('공통 상호작용', () => {
    it('헤더 내 로고 클릭하면 메인 페이지로 이동', () => {

      cy.intercept({
        method: "GET",
        url: "/api/category"
      }, {
        fixture: "category.json"
      }).as("getCategory"); 

      cy.intercept({
        method: "GET",
        url: "/api/project/categoryList?sortType=LATEST"
      }, {
        fixture: "categoryList.json"
      }).as("getCategoryList");

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

      cy.visit('/category')
      cy.get('[data-cy="logo-link"]').filter(':visible').click();
      // Link, Cypress, StrictMode 오류 발생으로 보이는 것 필터링하고 클릭
      cy.url().should('eq', 'http://localhost:3000/')
    })
})