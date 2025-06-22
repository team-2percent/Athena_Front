describe("메인 페이지 내 프로젝트 조회", () => {
  beforeEach(() => {
    // given - 메인 페이지 방문
    cy.fixture('planRankingView.json').then((planRankingView) => {
      cy.intercept({
        method: 'GET',
        url: '/api/project/planRankingView',
      }, {
        statusCode: 200,
        body: planRankingView,
      }).as('getPlanRankingView')
    })
    cy.fixture('categoryRankingView.json').then((categoryRankingView) => {
      cy.intercept({
        method: 'GET',
        url: '/api/project/categoryRankingView',
      }, {
        statusCode: 200,
        body: categoryRankingView,
      }).as('getCategoryRankingView')
    })
    cy.visit('/')
  })

  describe("프로젝트 조회 로딩", () => {
    describe("조회가 끝날 때까지 컴포넌트 자리에 스켈레톤 위치", () => {
      it("GET 요청 중", () => {
        // given - API 응답 설정 (지연 포함)
        cy.fixture('planRankingView.json').then((planRankingView) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/planRankingView',
          }, {
            ...planRankingView,
            delay: 1000
          }).as('getPlanRankingView')
        })
        cy.fixture('categoryRankingView.json').then((categoryRankingView) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/categoryRankingView',
          }, {
            ...categoryRankingView,
            delay: 1000
          }).as('getCategoryRankingView')
        })

        // when - 페이지 방문 (API 요청 시작)
        cy.visit('/')

        // then - Premium Carousel 스켈레톤 visible 확인, Pro Carousel 스켈레톤 visible 확인, Category Top5 스켈레톤 visible 확인
        cy.get('[data-cy="premium-carousel-skeleton"]').should('be.visible')
        cy.get('[data-cy="pro-carousel-skeleton"]').should('be.visible')
        cy.get('[data-cy="category-top5-skeleton"]').should('be.visible')
      })
    })
  })

  describe("프로젝트 조회 성공", () => {
    describe("메인 페이지가 정상적으로 표시", () => {
      it("GET 요청 모두 200", () => {
        // given - API 응답 설정
        cy.fixture('planRankingView.json').then((planRankingView) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/planRankingView',
          }, {
            statusCode: 200,
            body: planRankingView,
          }).as('getPlanRankingView')
        })
        cy.fixture('categoryRankingView.json').then((categoryRankingView) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/categoryRankingView',
          }, {
            statusCode: 200,
            body: categoryRankingView,
          }).as('getCategoryRankingView')
        })

        // when - 페이지 방문
        cy.visit('/')

        // then - Premium Carousel visible 확인, Pro Carousel visible 확인, Category Top5 visible 확인
        cy.wait('@getPlanRankingView').its('response.statusCode').should('eq', 200)
        cy.wait('@getCategoryRankingView').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="premium-carousel"]').should('be.visible')
        cy.get('[data-cy="pro-carousel"]').should('be.visible')
        cy.get('[data-cy="category-top5"]').should('be.visible')
      })
    })
  })

  describe("프로젝트 조회 실패", () => {
    describe("메인 페이지 내 요금제 캐러셀이 서버 에러로 미표시", () => {
      it("요금제 GET 요청 500", () => {
        // given - API 응답 설정 (요금제 서버 에러, CategoryTop5 성공)
        cy.intercept({
          method: 'GET',
          url: '/api/project/planRankingView',
        }, {
          statusCode: 500
        }).as('getPlanRankingView')
        cy.fixture('categoryRankingView.json').then((categoryRankingView) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/categoryRankingView',
          }, {
            statusCode: 200,
            body: categoryRankingView,
          }).as('getCategoryRankingView')
        })

        // when - 페이지 방문
        cy.visit('/')

        // then - Premium Carousel not.exist 확인, Pro Carousel not.exist 확인, Category Top5 visible 확인
        cy.wait('@getPlanRankingView').its('response.statusCode').should('eq', 500)
        cy.wait('@getCategoryRankingView').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="premium-carousel"]').should('not.exist')
        cy.get('[data-cy="pro-carousel"]').should('not.exist')
        cy.get('[data-cy="category-top5"]').should('be.visible')
      })
    })

    describe("메인 페이지 내 카테고리 Top5가 서버 에러로 미표시", () => {
      it("CategoryTop5 GET 요청 500", () => {
        // given - API 응답 설정 (요금제 성공, CategoryTop5 서버 에러)
        cy.fixture('planRankingView.json').then((planRankingView) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/planRankingView',
          }, {
            statusCode: 200,
            body: planRankingView,
          }).as('getPlanRankingView')
        })
        cy.intercept({
          method: 'GET',
          url: '/api/project/categoryRankingView',
        }, {
          statusCode: 500
        }).as('getCategoryRankingView')

        // when - 페이지 방문
        cy.visit('/')

        // then - Premium Carousel visible 확인, Pro Carousel visible 확인, Category Top5 not.exist 확인
        cy.wait('@getPlanRankingView').its('response.statusCode').should('eq', 200)
        cy.wait('@getCategoryRankingView').its('response.statusCode').should('eq', 500)
        cy.get('[data-cy="premium-carousel"]').should('be.visible')
        cy.get('[data-cy="pro-carousel"]').should('be.visible')
        cy.get('[data-cy="category-top5"]').should('not.exist')
      })
    })
  })
})