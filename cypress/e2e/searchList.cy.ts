import { listType, sortName } from '../../src/lib/listConstant';

describe("검색 프로젝트 목록", () => {
    beforeEach(() => {
        cy.fixture('list/projectList.json').then((projectList) => {
            cy
            .intercept('GET', '/api/project/search?sortType=*&searchTerm=*', projectList)
            .as('getSearchProjectList');
        });
        cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
            cy
            .intercept('GET', '/api/project/search?sortType=*&searchTerm=*&cursorValue=*&cursorId=*', nextProjectList)
            .as('getNextSearchProjectList');
        });

        cy.visitMainPage();
    })

    describe("검색 프로젝트 목록 조회", () => {
        it("검색 프로젝트 목록 조회 성공", () => {
            // given - 검색 프로젝트 목록 접근
            cy.get('[data-cy="search-input"]').type('테스트{enter}')
            cy.url().should('include', `/search?query=${encodeURIComponent('테스트')}`)

            // when - 검색 프로젝트 목록 조회 성공
            cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)

            // then - 검색 프로젝트 목록 20개 확인
            cy.get('[data-cy="list-header"]').should('be.visible')
            cy.get('[data-cy="list-header-search-word"]').should('be.visible').should('contain', '테스트')
            cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 20)
        })

        it("검색 프로젝트 목록 조회 성공, 데이터가 없을 때", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/search?sortType=*&searchTerm=*'
            }, {
                statusCode: 200,
                body: {
                    content: [],
                    nextCursorValue: null,
                    nextProjectId: null,
                    total: 0
                }
            }).as('getSearchProjectList')

            // given - 검색 프로젝트 목록 접근
            cy.get('[data-cy="search-input"]').type('테스트{enter}')
            cy.url().should('include', `/search?query=${encodeURIComponent('테스트')}`)

            // when - 검색 프로젝트 목록 조회 성공, 데이터가 없을 때
            cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)

            // then - 빈 메시지 확인
            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 검색 프로젝트 목록 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/search?sortType=*&searchTerm=*'
            }, {
                statusCode: 500
            }).as('getSearchProjectList')

            // given - 검색 프로젝트 목록 접근
            cy.get('[data-cy="search-input"]').type('테스트{enter}')
            cy.url().should('include', `/search?query=${encodeURIComponent('테스트')}`)

            // when - 검색 프로젝트 목록 조회 실패
            cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 500)
    
            // then - 검색 프로젝트 목록 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다.')
        })
    })

    describe("검색 프로젝트 목록 추가 조회", () => {
        beforeEach(() => {
            cy.get('[data-cy="search-input"]').type('테스트{enter}')
            cy.url().should('include', `/search?query=${encodeURIComponent('테스트')}`)
        })

        it("검색 프로젝트 목록 추가 조회 성공", () => {
            // when - 스크롤 이동, 검색 프로젝트 목록 추가 조회 성공
            cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)

            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            // then - 검색 프로젝트 목록 33개 확인
            cy.wait('@getNextSearchProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 33)

            // loading spinner 사라짐
            cy.get('[data-cy="loading-spinner"]').should('not.exist')
        })

        it("서버 오류로 인한 검색 프로젝트 목록 추가 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/search?sortType=*&searchTerm=*&cursorValue=*&cursorId=*'
            }, {
                statusCode: 500
            }).as('getNextSearchProjectList')

            // when - 검색 프로젝트 목록 추가 조회 실패
            cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)

            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            cy.wait('@getNextSearchProjectList').its('response.statusCode').should('eq', 500)

            // then - 검색 프로젝트 목록 추가 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
        })
    })

    describe("검색 프로젝트 목록 정렬 변경", () => {
        beforeEach(() => {
            cy.get('[data-cy="search-input"]').type('테스트{enter}')
            cy.url().should('include', `/search?query=${encodeURIComponent('테스트')}`)

            cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["LATEST"]).click()

            cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')
            listType.search.sort.forEach((sortKey: string) => {
              cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName[sortKey as keyof typeof sortName]).should('be.visible');
            });
        })

        it("정렬 변경 성공", () => {
            cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName["POPULAR"]).click()

            cy.wait('@getSearchProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
            cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["POPULAR"])
        })

        it("서버 오류로 인한 정렬 변경 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/search?sortType=*&searchTerm=*'
            }, {
                statusCode: 500
            }).as('getNextSearchProjectList')

            cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName["POPULAR"]).click()

            cy.wait('@getNextSearchProjectList').its('response.statusCode').should('eq', 500)

            // then - 검색 프로젝트 목록 정렬 변경 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
            cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
            cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["POPULAR"])
        })
    })
})
