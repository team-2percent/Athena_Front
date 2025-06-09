describe("마감 임박 프로젝트 목록", () => {
    beforeEach(() => {
        cy.fixture('list/projectList.json').then((projectList) => {
            cy
            .intercept('GET', '/api/project/deadlineList?sortTypeDeadline=*', projectList)
            .as('getDeadlineProjectList');
        });

        cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
            cy
            .intercept('GET', '/api/project/deadlineList?sortTypeDeadline=*&cursorValue=*&lastProjectId=*', nextProjectList)
            .as('getNextDeadlineProjectList');
        });

        cy.visitMainPage();
    })

    describe("마감 임박 프로젝트 목록 조회", () => {
        it("마감 임박 프로젝트 목록 조회 성공", () => {
            // given - 마감 임박 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-마감임박"]').click()
            cy.url().should('include', '/deadline')

            // when - 마감 임박 프로젝트 목록 조회 성공
            cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

            // then - 마감 임박 프로젝트 목록 20개 확인
            cy.get('[data-cy="list-header"]').should('be.visible')
            cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 20)
        })

        it("마감 임박 프로젝트 목록 조회 성공, 데이터가 없을 때", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/deadlineList?sortTypeDeadline=*'
            }, {
                statusCode: 200,
                body: {
                    content: [],
                    nextCursorValue: null,
                    nextProjectId: null,
                    total: 0
                }
            }).as('getDeadlineProjectList')

            // given - 마감 임박 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-마감임박"]').click()
            cy.url().should('include', '/deadline')

            // when - 마감 임박 프로젝트 목록 조회 성공, 데이터가 없을 때
            cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

            // then - 빈 메시지 확인
            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 마감 임박 프로젝트 목록 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/deadlineList?sortTypeDeadline=*'
            }, {
                statusCode: 500
            }).as('getDeadlineProjectList')

            // given - 마감 임박 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-마감임박"]').click()
            cy.url().should('include', '/deadline')

            // when - 마감 임박 프로젝트 목록 조회 실패
            cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 500)
    
            // then - 마감 임박 프로젝트 목록 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다.')
        })
    })

    describe("마감 임박 프로젝트 목록 추가 조회", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-마감임박"]').click()
            cy.url().should('include', '/deadline')
        })

        it("마감 임박 프로젝트 목록 추가 조회 성공", () => {
            // when - 스크롤 이동, 마감 임박 프로젝트 목록 추가 조회 성공
            cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            // then - 마감 임박 프로젝트 목록 33개 확인
            cy.wait('@getNextDeadlineProjectList', { timeout: 10000 }).its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 33)

            // loading spinner 사라짐
            cy.get('[data-cy="loading-spinner"]').should('not.exist')
        })

        it("서버 오류로 인한 마감 임박 프로젝트 목록 추가 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/deadlineList?sortTypeDeadline=*&cursorValue=*&lastProjectId=*'
            }, {
                statusCode: 500
            }).as('getNextDeadlineProjectList')

            // when - 마감 임박 프로젝트 목록 추가 조회 실패
            cy.wait('@getDeadlineProjectList', { timeout: 10000 }).its('response.statusCode').should('eq', 200)

            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            cy.wait('@getNextDeadlineProjectList').its('response.statusCode').should('eq', 500)

            // then - 마감 임박 프로젝트 목록 추가 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
        })
    })

    describe("마감 임박 프로젝트 목록 정렬 변경", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-마감임박"]').click()
            cy.url().should('include', '/deadline')

            cy.get('[data-cy="list-header-sort-button"]').should('contain', '마감순').click()

            cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')
            cy.get('[data-cy="list-header-sort-DEADLINE"]').should('be.visible')
            cy.get('[data-cy="list-header-sort-DEADLINE_POPULAR"]').should('be.visible')
            cy.get('[data-cy="list-header-sort-DEEADLINE_SUCCESS_RATE"]').should('be.visible')
        })

        it("정렬 변경 성공", () => {
            cy.get('[data-cy="list-header-sort-DEADLINE_POPULAR"]').click()

            cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
            cy.get('[data-cy="list-header-sort-button"]').should('contain', '인기순')
        })

        it("서버 오류로 인한 정렬 변경 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/deadlineList?sortTypeDeadline=*'
            }, {
                statusCode: 500
            }).as('getNextDeadlineProjectList')

            cy.get('[data-cy="list-header-sort-DEADLINE_POPULAR"]').click()

            cy.wait('@getNextDeadlineProjectList').its('response.statusCode').should('eq', 500)

            // then - 마감 임박 프로젝트 목록 정렬 변경 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
            cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
            cy.get('[data-cy="list-header-sort-button"]').should('contain', '인기순')
        })
    })
})
