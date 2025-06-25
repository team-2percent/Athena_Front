describe("메인 페이지 내 프로젝트 조회", () => {
  beforeEach(() => {
    cy.task('resetApiMocks');
  })

  describe("프로젝트 조회 로딩", () => {
    describe("조회가 끝날 때까지 컴포넌트 자리에 스켈레톤 위치", () => {
      it("GET 요청 중", () => {
        // when - 페이지 방문 (API 요청 시작)
        cy.fixture('planRankingView.json').then((planRankingView) => {
          cy.task('mockApiResponse', { endpoint: '/api/project/planRankingView', data: planRankingView });
        })
        cy.fixture('categoryRankingView.json').then((categoryRankingView) => {
          cy.task('mockApiResponse', { endpoint: '/api/project/categoryRankingView', data: categoryRankingView });
        })

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
        cy.fixture('planRankingView.json').then((planRankingView) => {
          cy.task('mockApiResponse', { operationName: 'planRankingView', data: planRankingView });
        })
        cy.fixture('categoryRankingView.json').then((categoryRankingView) => {
          cy.task('mockApiResponse', { operationName: 'categoryRankingView', data: categoryRankingView });
        })

        // when - 페이지 방문
        cy.visit('/')

        // then - Premium Carousel visible 확인, Pro Carousel visible 확인, Category Top5 visible 확인
        cy.get('[data-cy="premium-carousel"]').should('be.visible')
        cy.get('[data-cy="pro-carousel"]').should('be.visible')
        cy.get('[data-cy="category-top5"]').should('be.visible')
      })
    })
  })

  describe("프로젝트 조회 실패", () => {
    describe("메인 페이지 내 요금제 캐러셀이 서버 에러로 미표시", () => {
      it("요금제 GET 요청 500", () => {
        cy.task('mockApiErrorResponse', { operationName: 'planRankingView', message: 'Internal Server Error' });
        // when - 페이지 방문
        cy.visit('/')

        // then - Premium Carousel not.exist 확인, Pro Carousel not.exist 확인, Category Top5 visible 확인
        cy.checkServerErrorCard("다시 시도해 주세요.")
      })
    })

    describe("메인 페이지 내 카테고리 Top5가 서버 에러로 미표시", () => {
      it("CategoryTop5 GET 요청 500", () => {
        cy.task('mockApiErrorResponse', { operationName: 'categoryRankingView', message: 'Internal Server Error' });
        // when - 페이지 방문
        cy.visit('/')

        // then - Premium Carousel visible 확인, Pro Carousel visible 확인, Category Top5 not.exist 확인
        cy.checkServerErrorCard("다시 시도해 주세요.")
      })
    })
  })
})