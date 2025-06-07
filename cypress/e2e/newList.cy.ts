describe("신규 프로젝트 목록", () => {
    beforeEach(() => {
        cy.fixture('list/projectList.json').then((projectList) => {
            cy.intercept('GET', '/api/project/recentList', projectList).as('getProjectList');
        });

        cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
            cy.intercept('GET', '/api/project/recentList?cursorValue=*&lastProjectId=*', nextProjectList).as('getNextProjectList');
        });

        // given - 로그인, 신규 프로젝트 목록 접근
        cy.visitMainPage();
        
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-신규"]').click()
    })

    describe("프로젝트 목록 조회", () => {
        it("프로젝트 목록 조회 성공", () => {
            // when - 프로젝트 목록 조회 성공
            cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)

            // then - 프로젝트 목록 20개 확인
            cy.get('[data-cy="list-header"]').should('be.visible')
            cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 20)
        })

        it("프로젝트 목록 추가 조회 성공", () => {
            // when - 스크롤 이동, 프로젝트 목록 추가 조회 성공
            cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)

            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            // then - 프로젝트 목록 33개 확인
            cy.wait('@getNextProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 33)
        })

        it("프로젝트 목록 조회 성공, 데이터가 없을 때", () => {
            cy.intercept('GET', '/api/project/recentList', {
                statusCode: 200,
                body: {
                    content: [],
                    nextCursorValue: null,
                    nextProjectId: null,
                    total: 0
                }
            }).as('getProjectList')

            // when - 프로젝트 목록 조회 성공, 데이터가 없을 때
            cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)

            // then - 빈 메시지 확인
            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 프로젝트 목록 조회 실패", () => {
            cy.intercept('GET', '/api/project/recentList', {
                statusCode: 500
            }).as('getProjectList')

            // when - 프로젝트 목록 조회 실패
            cy.wait('@getProjectList').its('response.statusCode').should('eq', 500)
    
            // then - 프로젝트 목록 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다.')
        })

        it("서버 오류로 인한 프로젝트 목록 추가 조회 실패", () => {
            cy.intercept('GET', '/api/project/recentList?cursorValue=*&lastProjectId=*', {
                statusCode: 500
            }).as('getNextProjectList')

            // when - 프로젝트 목록 추가 조회 실패
            cy.wait('@getProjectList').its('response.statusCode').should('eq', 200)

            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            cy.wait('@getNextProjectList').its('response.statusCode').should('eq', 500)

            // then - 프로젝트 목록 추가 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
        })
    })
})