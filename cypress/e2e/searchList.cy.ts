import { listType, sortName } from '../../src/lib/listConstant';

describe("검색 결과 프로젝트 조회", () => {
  beforeEach(() => {
    
  })

  describe("헤더 검색 Input에서 검색어 표시", () => {
    it("검색 Input 내용과 query 일치", () => {
      // given - 검색 페이지 방문
      cy.fixture('list/projectList.json').then((projectList) => {
        cy.intercept({
          method: 'GET',
          url: '/api/project/search?sortType=LATEST&searchTerm=*'
        }, {
          statusCode: 200,
          body: projectList,
        }).as('getSearchProjectList')
      })
      cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')
      cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)
      // then - 검색 Input 내용과 query 일치 확인
      cy.get('[data-cy="search-input"]').should('have.value', '테스트')
    })
  })

  describe("리스트 헤더에서 검색어 표시", () => {
    it("리스트 헤더 검색어 내용과 query 일치", () => {
      // given - 검색 페이지 방문
      cy.fixture('list/projectList.json').then((projectList) => {
        cy.intercept({
          method: 'GET',
          url: '/api/project/search?sortType=LATEST&searchTerm=*'
        }, {
          statusCode: 200,
          body: projectList,
        }).as('getSearchProjectList')
      })
      cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')
      cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)
      // then - 리스트 헤더 검색어 내용과 query 일치 확인
      cy.get('[data-cy="list-header-search-word"]').should('be.visible').should('contain', '테스트')
    })
  })

  describe("정렬 select 선택", () => {
    beforeEach(() => {
      // given - 검색 페이지 방문
      cy.fixture('list/projectList.json').then((projectList) => {
        cy.intercept({
          method: 'GET',
          url: '/api/project/search?sortType=LATEST&searchTerm=*'
        }, {
          statusCode: 200,
          body: projectList,
        }).as('getSearchProjectList')
      })
      cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')
      cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)
    })
    describe("정렬 표시", () => {
      it("정렬 select visible 확인, 최신순 텍스트 확인 성공", () => {
        // when - 정렬 select 클릭
        cy.get('[data-cy="list-header-sort-button"]').should('be.visible').should('contain', sortName["LATEST"]).click()

        // then - 정렬 select 내 옵션 확인
        cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')
        listType.search.sort.forEach((sortKey: string) => {
          cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName[sortKey as keyof typeof sortName]).should('be.visible')
        })
      })
    })

    describe("현재 상태인 최신순 설정 시 아무일도 일어나지 않고 select 닫힘", () => {
      it("옵션 '최신순' 클릭", () => {
        // given - 정렬 select 클릭
        cy.get('[data-cy="list-header-sort-button"]').click()
        cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')

        // when - 옵션 '최신순' 클릭
        cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName["LATEST"]).click()

        // then - select 닫힘 확인 및 text 확인
        cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
        cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["LATEST"])
      })
    })

    describe("인기순 변경 시 API 요청, select 닫힘", () => {
      it("옵션 '인기순' 클릭", () => {
        // given - API 응답 설정
        cy.fixture('list/projectList.json').then((projectList) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/search?sortType=POPULAR&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8'
          }, {
            statusCode: 200,
            body: projectList,
          }).as('getPopularSearchProjectList')
        })

        // given - 정렬 select 클릭
        cy.get('[data-cy="list-header-sort-button"]').click()
        cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')

        // when - 옵션 '인기순' 클릭
        cy.get('[data-cy="list-header-sort-dropdown"]').contains("인기순").click()

        // then - 인기순 API 요청 확인, select 닫힘 확인, text 확인
        cy.wait('@getPopularSearchProjectList').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
        cy.get('[data-cy="list-header-sort-button"]').should('contain', "인기순")
      })
    })

    describe("달성률순 변경 시 API 요청, select 닫힘", () => {
      it("옵션 '달성률순' 클릭", () => {
        // given - API 응답 설정
        cy.fixture('list/projectList.json').then((projectList) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/search?sortType=SUCCESS_RATE&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8'
          }, {
            statusCode: 200,
            body: projectList,
          }).as('getAchievementRateSearchProjectList')
        })

        // given - 정렬 select 클릭
        cy.get('[data-cy="list-header-sort-button"]').click()
        cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')

        // when - 옵션 '달성률순' 클릭
        cy.get('[data-cy="list-header-sort-dropdown"]').contains("달성률순").click()

        // then - 달성률순 API 요청 확인, select 닫힘 확인, text 확인
        cy.wait('@getAchievementRateSearchProjectList').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
        cy.get('[data-cy="list-header-sort-button"]').should('contain', "달성률순")
      })
    })
  })

  describe("리스트", () => {
    describe("조회 로딩 중 프로젝트 건수 표시 문구, 프로젝트 리스트에 스켈레톤 위치", () => {
      it("프로젝트 GET 요청 중", () => {
        // given - API 응답 설정 (지연 포함)
        cy.fixture('list/projectList.json').then((projectList) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/search?sortType=*&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8'
          }, {
            statusCode: 200,
            body: projectList,
            delay: 2000
          }).as('getSearchProjectList')
        })

        // when - 페이지 방문 (API 요청 시작)
        cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')

        // then - 건수 표시 문구 스켈레톤 visible 확인, 리스트 스켈레톤 visible 확인
        cy.get('[data-cy="list-header-count-skeleton"]').should('be.visible')
        cy.get('[data-cy="project-list-skeleton"]').should('be.visible')
      })
    })

    describe("조회 시 20개 이상일 때 프로젝트 건수를 표시하고, 20개로 프로젝트 리스트를 표시", () => {
      it("프로젝트 GET 요청 200", () => {
        // given - API 응답 설정
        cy.fixture('list/projectList.json').then((projectList) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/search?sortType=*&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8'
          }, {
            statusCode: 200,
            body: projectList,
          }).as('getSearchProjectList')
        })

        // when - 페이지 방문
        cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')

        // then - API 요청 확인, 건수 표시 확인, 리스트 20개 확인
        cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
        cy.get('[data-cy="project-list-item"]').should('have.length', 20)
      })
    })

    describe("마지막 추가 조회 시 20개 이내의 다음 프로젝트를 표시하고, loading bar 없음 확인", () => {
      it("프로젝트 추가 GET 요청 200", () => {
        // given - API 응답 설정
        // given - 검색 페이지 방문
        cy.fixture('list/projectList.json').then((projectList) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/search?sortType=LATEST&searchTerm=*'
          }, {
            statusCode: 200,
            body: projectList,
          }).as('getSearchProjectList')
        })
    
        cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
          cy.intercept({
            method: 'GET',
            url: '/api/project/search?sortType=*&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8&cursorValue=*&cursorId=*'
          }, {
            statusCode: 200,
            body: nextProjectList,
          }).as('getNextSearchProjectList')
        })

        // given - 페이지 방문
        cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')
        cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)

        // when - 맨 아래로 스크롤
        cy.scrollTo('bottom')

        // then - loading bar visible 확인, 추가 API 요청 확인, 프로젝트 리스트 사이즈 확인, loading bar not.exist 확인
        cy.get('[data-cy="loading-spinner"]').should('be.visible')
        cy.wait('@getNextSearchProjectList').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="project-list-item"]').should('have.length', 33)
        cy.get('[data-cy="loading-spinner"]').should('not.exist')
      })
    })

    describe("데이터가 없을 시 프로젝트 건수를 0으로 표시하고, 비어있음 메시지 표시", () => {
      it("프로젝트 GET 요청 200, 데이터 없음", () => {
        // given - API 응답 설정 (빈 데이터)
        cy.intercept('GET', '/api/project/search?sortType=*&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8', {
          statusCode: 200,
          body: {
            content: [],
            nextCursorValue: null,
            nextProjectId: null,
            total: 0
          }
        }).as('getSearchProjectList')

        // when - 페이지 방문
        cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')

        // then - API 요청 확인, 건수 표시 '0' 확인, 리스트 0개 확인, 비어있음 메시지 확인
        cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '0')
        cy.get('[data-cy="project-list-item"]').should('have.length', 0)
        cy.get('[data-cy="empty-message-card"]').should('be.visible')
        cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
      })
    })

    describe("서버 에러 시 프로젝트 건수를 -으로 표시하고, 서버에러 메시지 표시", () => {
      it("프로젝트 GET 요청 500", () => {
        // given - API 응답 설정 (서버 에러)
        cy.intercept({
          method: 'GET',
          url: '/api/project/search?sortType=*&searchTerm=%ED%85%8C%EC%8A%A4%ED%8A%B8'
        }, {
          statusCode: 500
        }).as('getSearchProjectList')

        // when - 페이지 방문
        cy.visit('/search?query=%ED%85%8C%EC%8A%A4%ED%8A%B8')

        // then - API 요청 500 확인, 건수 표시 '-' 확인, 프로젝트 0개 확인, 서버 에러 메시지 확인
        cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 500)
        cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '-')
        cy.get('[data-cy="project-list-item"]').should('have.length', 0)
        cy.get('[data-cy="server-error-card"]').should('be.visible')
        cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')

        // when - 다시시도 버튼 클릭
        cy.get('[data-cy="retry-button"]').click()

        // then - 똑같은 API 요청 확인
        cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 500)
      })
    })
  })
})
