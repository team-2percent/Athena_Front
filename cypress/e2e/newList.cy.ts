describe("신규 프로젝트 조회", () => {
    beforeEach(() => {
        // given - 신규 프로젝트 페이지 방문
        cy.fixture('list/projectList.json').then((projectList) => {
            cy.intercept('GET', '/api/project/recentList', projectList).as('getProjectList')
        })
        cy.visit('/new')
        cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)
    })

    describe("리스트", () => {
        describe("조회 로딩 중 프로젝트 건수 표시 문구, 프로젝트 리스트에 스켈레톤 위치", () => {
            it("프로젝트 GET 요청 중", () => {
                // given - API 응답 설정 (지연 포함)
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept('GET', '/api/project/recentList', {
                        ...projectList,
                        delay: 1000
                    }).as('getProjectList')
                })

                // when - 페이지 방문 (API 요청 시작)
                cy.visit('/new')

                // then - 건수 표시 문구 스켈레톤 visible 확인, 리스트 스켈레톤 visible 확인
                cy.get('[data-cy="list-header-count-skeleton"]').should('be.visible')
                cy.get('[data-cy="project-list-skeleton"]').should('be.visible')
            })
        })

        describe("조회 시 20개 이상일 때 프로젝트 건수를 표시하고, 20개로 프로젝트 리스트를 표시", () => {
            it("프로젝트 GET 요청 200", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept('GET', '/api/project/recentList', projectList).as('getProjectList')
                })

                // when - 페이지 방문
                cy.visit('/new')

                // then - API 요청 확인, 건수 표시 확인, 리스트 20개 확인
                cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
                cy.get('[data-cy="project-list-item"]').should('have.length', 20)
            })
        })

        describe("마지막 추가 조회 시 20개 이내의 다음 프로젝트를 표시하고, loading bar 없음 확인", () => {
            it("프로젝트 추가 GET 요청 200", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept('GET', '/api/project/recentList', projectList).as('getProjectList')
                })
                cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
                    cy.intercept('GET', '/api/project/recentList?cursorValue=*&lastProjectId=*', nextProjectList).as('getNextProjectList')
                })

                // given - 페이지 방문 및 초기 로딩 완료
                cy.visit('/new')
                cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)

                // when - 맨 아래로 스크롤
                cy.scrollTo('bottom')

                // then - loading bar visible 확인, 추가 API 요청 확인, 프로젝트 리스트 사이즈 확인, loading bar not.exist 확인
                cy.get('[data-cy="loading-spinner"]').should('be.visible')
                cy.wait('@getNextProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="project-list-item"]').should('have.length', 33)
                cy.get('[data-cy="loading-spinner"]').should('not.exist')
            })
        })

        describe("데이터가 없을 시 프로젝트 건수를 0으로 표시하고, 비어있음 메시지 표시", () => {
            it("프로젝트 GET 요청 200, 데이터 없음", () => {
                // given - API 응답 설정 (빈 데이터)
                cy.intercept('GET', '/api/project/recentList', {
                    statusCode: 200,
                    body: {
                        content: [],
                        nextCursorValue: null,
                        nextProjectId: null,
                        total: 0
                    }
                }).as('getProjectList')

                // when - 페이지 방문
                cy.visit('/new')

                // then - API 요청 확인, 건수 표시 '0' 확인, 리스트 0개 확인, 비어있음 메시지 확인
                cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '0')
                cy.get('[data-cy="project-list-item"]').should('have.length', 0)
                cy.get('[data-cy="empty-message-card"]').should('be.visible')
                cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
            })
        })

        describe("서버 에러 시 프로젝트 건수를 -으로 표시하고, 서버에러 메시지 표시", () => {
            it("프로젝트 GET 요청 500", () => {
                // given - API 응답 설정 (서버 에러)
                cy.intercept('GET', '/api/project/recentList', {
                    statusCode: 500
                }).as('getProjectList')

                // when - 페이지 방문
                cy.visit('/new')

                // then - API 요청 500 확인, 건수 표시 '-' 확인, 프로젝트 0개 확인, 서버 에러 메시지 확인
                cy.wait('@getProjectList').its('response.statusCode').should('eq', 500)
                cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '-')
                cy.get('[data-cy="project-list-item"]').should('have.length', 0)
                cy.get('[data-cy="server-error-card"]').should('be.visible')
                cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')

                // when - 다시시도 버튼 클릭
                cy.get('[data-cy="retry-button"]').click()

                // then - 똑같은 API 요청 확인
                cy.wait('@getProjectList').its('response.statusCode').should('eq', 500)
            })
        })
    })
})