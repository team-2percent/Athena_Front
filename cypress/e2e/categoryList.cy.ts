import { listType, sortName } from '../../src/lib/listConstant';

describe("카테고리 프로젝트 목록", () => {
    beforeEach(() => {
        cy.fixture('list/category.json').then((categoryList) => {
            cy
            .intercept('GET', '/api/category', categoryList)
            .as('getCategoryList');
        });

        cy.fixture('list/projectList.json').then((projectList) => {
            cy
            .intercept('GET', '/api/project/categoryList?sortType=*', projectList)
            .as('getCategoryProjectList');
        });

        cy.fixture('list/projectList.json').then((projectList) => {
            cy
            .intercept('GET', '/api/project/categoryList?categoryId=*&sortType=*', projectList)
            .as('getCategoryProjectList');
        });

        cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
            cy
            .intercept('GET', '/api/project/categoryList?sortType=*&cursorValue=*&cursorId=*', nextProjectList)
            .as('getNextCategoryProjectList');
        });

        cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
            cy
            .intercept('GET', '/api/project/categoryList?categoryId=*&sortType=*&cursorValue=*&cursorId=*', nextProjectList)
            .as('getNextCategoryProjectList');
        });

        cy.visitMainPage();
    })

    describe("카테고리 목록 조회", () => {
        it("카테고리 목록 조회 성공", () => {
            // given - 카테고리 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')

            // when - 카테고리 목록 조회 성공
            cy.wait('@getCategoryList').its('response.statusCode').should('eq', 200)

            // then - 카테고리 목록 전체 포함 9개 확인
            cy.get('[data-cy="category-list"]').should('be.visible')
            cy.get('[data-cy="category-list-item"]').should('have.length', 9)
            cy.get('[data-cy="category-list-item"]').first().should('contain', '전체')
        })

        it("서버 오류로 인한 카테고리 목록 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/category'
            }, {
                statusCode: 500
            }).as('getCategoryList');

            // given - 카테고리 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')

            // when - 카테고리 목록 조회 실패
            cy.wait('@getCategoryList').its('response.statusCode').should('eq', 500)

            // then - 카테고리 목록 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '카테고리를 불러오는 중 오류가 발생했습니다.')
            cy.get('[data-cy="list-header"]').should('not.exist')
            cy.get('[data-cy="project-list"]').should('not.exist')
            cy.get('[data-cy="loading-spinner"]').should('not.exist')
        })
    })

    describe("카테고리 프로젝트 목록 조회", () => {
        it("카테고리 프로젝트 목록 조회 성공", () => {
            // given - 카테고리 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')

            // when - 카테고리 프로젝트 목록 조회 성공
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            // then - 카테고리 프로젝트 목록 20개 확인
            cy.get('[data-cy="list-header"]').should('be.visible')
            cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 20)
        })

        it("카테고리 프로젝트 목록 조회 성공, 데이터가 없을 때", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/categoryList?sortType=*'
            }, {
                statusCode: 200,
                body: {
                    content: [],
                    nextCursorValue: null,
                    nextProjectId: null,
                    total: 0
                }
            }).as('getCategoryProjectList')

            // given - 카테고리 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')

            // when - 카테고리 프로젝트 목록 조회 성공, 데이터가 없을 때
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            // then - 빈 메시지 확인
            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 카테고리 프로젝트 목록 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/categoryList?sortType=*'
            }, {
                statusCode: 500
            }).as('getCategoryProjectList')

            // given - 카테고리 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')

            // when - 카테고리 프로젝트 목록 조회 실패
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 500)
    
            // then - 카테고리 프로젝트 목록 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다.')
        })
    })

    describe("카테고리 프로젝트 목록 추가 조회", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)
        })

        it("카테고리 프로젝트 목록 추가 조회 성공", () => {
            // when - 스크롤 이동, 카테고리 프로젝트 목록 추가 조회 성공
            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            // then - 카테고리 프로젝트 목록 33개 확인
            cy.wait('@getNextCategoryProjectList', { timeout: 10000 }).its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 33)

            // loading spinner 사라짐
            cy.get('[data-cy="loading-spinner"]').should('not.exist')
        })

        it("서버 오류로 인한 카테고리 프로젝트 목록 추가 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/categoryList?sortType=*&cursorValue=*&cursorId=*'
            }, {
                statusCode: 500
            }).as('getNextCategoryProjectList')

            // when - 카테고리 프로젝트 목록 추가 조회 실패
            cy.scrollTo('bottom')
            cy.get('[data-cy="loading-spinner"]').should('be.visible')

            cy.wait('@getNextCategoryProjectList', { timeout: 10000 }).its('response.statusCode').should('eq', 500)

            // then - 카테고리 프로젝트 목록 추가 조회 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
        })
    })

    describe("카테고리 프로젝트 목록 카테고리 변경", () => {
        beforeEach(() => {
            // given - 카테고리 프로젝트 목록 접근
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.url().should('include', '/category')
        })

        it("카테고리 변경 성공", () => {
            // when - 카테고리 변경 성공
            cy.get('[data-cy="category-list-item"]').eq(1).click()
            cy.url().should('include', '/category/1')

            // then - 카테고리 프로젝트 목록 20개 확인
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="category-list-item"]').eq(1).should('have.class', 'bg-secondary-color border-main-color')

            cy.get('[data-cy="list-header"]').should('be.visible')  
            cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
            cy.get('[data-cy="project-list"]').should('be.visible')
            cy.get('[data-cy="project-list-item"]').should('have.length', 20)
        })

        it("카테고리 변경 성공, 데이터가 없을 때", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/categoryList?categoryId=*&sortType=*'
            }, {
                statusCode: 200,
                body: {
                    content: [],
                    nextCursorValue: null,
                    nextProjectId: null,
                    total: 0
                }
            }).as('getCategoryProjectList')

            // when - 카테고리 변경 성공
            cy.get('[data-cy="category-list-item"]').eq(1).click()
            cy.url().should('include', '/category/1')

            // then - 카테고리 프로젝트 목록 20개 확인
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="category-list-item"]').eq(1).should('have.class', 'bg-secondary-color border-main-color')

            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 카테고리 변경 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/categoryList?categoryId=*&sortType=*'
            }, {
                statusCode: 500
            }).as('getCategoryProjectList')

            // when - 카테고리 변경 실패
            cy.get('[data-cy="category-list-item"]').eq(1).click()
            cy.url().should('include', '/category/1')

            // then - 카테고리 프로젝트 목록 추가 조회 실패
            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="category-list-item"]').eq(1).should('have.class', 'bg-secondary-color border-main-color')

            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
        })
    })

    describe("카테고리 프로젝트 목록 정렬 변경", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-카테고리"]').click()
            cy.get('[data-cy="category-list-item"]').first().click()
            cy.url().should('include', '/category')

            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["LATEST"]).click()

            cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')
            listType.category.sort.forEach((sortKey: string) => {
              cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName[sortKey as keyof typeof sortName]).should('be.visible');
            });
        })

        it("정렬 변경 성공", () => {
            cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName["POPULAR"]).click()

            cy.wait('@getCategoryProjectList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
            cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["POPULAR"])
        })

        it("서버 오류로 인한 정렬 변경 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/categoryList?sortType=*'
            }, {
                statusCode: 500
            }).as('getNextCategoryProjectList')

            cy.get('[data-cy="list-header-sort-dropdown"]').contains(sortName["POPULAR"]).click()

            cy.wait('@getNextCategoryProjectList').its('response.statusCode').should('eq', 500)

            // then - 카테고리 프로젝트 목록 정렬 변경 실패
            cy.get('[data-cy="server-error-card"]').should('be.visible')
            cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')
            cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
            cy.get('[data-cy="list-header-sort-button"]').should('contain', sortName["POPULAR"])
        })
    })
})
