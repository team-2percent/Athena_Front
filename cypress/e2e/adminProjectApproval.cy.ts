describe("관리자 프로젝트 승인 페이지", () => {
    beforeEach(() => {
        cy.visitMainPage();
        cy.adminLogin();
    })

    describe("프로젝트 목록", () => {
        it("정상 조회 시 프로젝트 목록 정상 표시", () => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                    statusCode: 200,
                    body: projectList
                })
            }).as('getProjectList')
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
            
            cy.get('[data-cy="project-approval-list"]').should("be.visible")
            cy.get('[data-cy="project-approval-list-item"]').should("have.length", 10)
            cy.get('[data-cy="project-approval-list-item"]').first().within(() => {
                cy.get('[data-cy="project-number"]').should("be.visible")
                cy.get('[data-cy="project-title"]').should("be.visible")
                cy.get('[data-cy="project-date"]').should("be.visible")
                cy.get('[data-cy="project-seller"]').should("be.visible")
                cy.get('[data-cy="project-status"]').should("be.visible")
            })
        })

        it("서버 에러 시 서버에러 메시지 표시", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=0&direction=*'
            }, {
                statusCode: 500,
            }).as('getProjectListError')

            cy.visit("/admin/approval")
            cy.wait('@getProjectListError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 승인 목록 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should("be.visible")
        })

        it('프로젝트 클릭 시 상세 페이지로 이동', () => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                    statusCode: 200,
                    body: projectList
                })
            }).as('getProjectList')
            cy.fixture('admin/approval/projectDetail.json').then((projectDetail) => {
                cy.intercept('GET', '/api/admin/project/*', {
                    statusCode: 200,
                    body: projectDetail
                })
            }).as('getProjectDetail')

            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="project-approval-list-item"]').first().click()
            cy.url().should('include', '/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
        })
    })

    describe("정렬", () => {
        beforeEach(() => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                    statusCode: 200,
                    body: projectList
                })
            }).as('getProjectList')
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
        })

        it("정렬 select 표시", () => {
            cy.get('[data-cy="sort-select"]').should('be.visible').should('contain', "오래된순")
            cy.get('[data-cy="sort-select"] option').should('have.length', 2)
            cy.get('[data-cy="sort-select"] option').eq(0).should('have.value', 'asc')
            cy.get('[data-cy="sort-select"] option').eq(1).should('have.value', 'desc')
            cy.get('[data-cy="sort-select"]').select('asc')
            cy.get('[data-cy="sort-select"]').should('have.value', 'asc')
        })

        it("정렬 현재 상태 클릭 시 요청 없음", () => {
            cy.get('[data-cy="sort-select"]').select('asc')
            cy.get('[data-cy="sort-select"]').should('have.value', 'asc')
        })

        it("정렬 다른 상태 클릭 시 리로드", () => {
            cy.get('[data-cy="sort-select"]').select('desc')
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="sort-select"]').should('have.value', 'desc')
        })
    })

    describe("검색", () => {
        beforeEach(() => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                    statusCode: 200,
                    body: projectList
                })
            }).as('getProjectList')
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
        })
    
        it("검색창 표시", () => {
            cy.get('[data-cy="search-input"]').should('be.visible')
            cy.get('[data-cy="search-button"]').should('be.disabled')
        })

        it("검색창 입력값 없을 시 검색 버튼 비활성화", () => {
            cy.get('[data-cy="search-input"]').type("테스트")
            cy.get('[data-cy="search-button"]').should('not.be.disabled')
            cy.get('[data-cy="search-input"]').clear()
            cy.get('[data-cy="search-button"]').should('be.disabled')
        })

        it("검색창 20자 초과 입력 시 제한", () => {
            cy.get('[data-cy="search-input"]').type("a".repeat(21))
            cy.get('[data-cy="search-input"]').should('have.value', "a".repeat(20))
            cy.get('[data-cy="search-button"]').should('not.be.disabled')
        })

        it("검색창 입력 후 검색 시 리로드", () => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*&keyword=*', {
                    statusCode: 200,
                    body: projectList
                })
            }).as('getSearchProjectList')
            cy.get('[data-cy="search-input"]').type("테스트")
            cy.get('[data-cy="search-button"]').click()
            cy.wait('@getSearchProjectList').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="search-input"]').should('have.value', "테스트")
        })
    })

    describe("페이지네이션", () => {
        beforeEach(() => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                    statusCode: 200,
                    body: projectList
                })
            }).as('getProjectList')
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
            cy.scrollTo('bottom')
        })

        it("첫 페이지에서는 다른 페이지와 마지막 페이지 이동, 다음 페이지 이동 버튼만 활성화", () => {
            cy.get('[data-cy="pagination"]').should('be.visible')
            cy.get('[data-cy="first-page-button"]').should('be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('be.disabled')
            cy.get('[data-cy="page-button"]').first().should('have.class', 'bg-main-color').should('be.disabled')
            cy.get('[data-cy="page-button"]').not(':first').should('not.be.disabled')
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled')
        })

        it("중간 페이지에서는 현재 페이지 제외 모두 활성화", () => {
            cy.fixture('admin/approval/nextProjectList.json').then((nextProjectList) => {
                cy.intercept('GET', '/api/admin/project?page=1&direction=*', {
                    statusCode: 200,
                    body: nextProjectList
                })
            }).as('getNextProjectList')
            cy.get('[data-cy="page-button"]').eq(1).click()
            cy.wait('@getNextProjectList').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="first-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="page-button"]').eq(1).should('have.class', 'bg-main-color').should('be.disabled')
            cy.get('[data-cy="page-button"]').not(':eq(1)').should('not.be.disabled')
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled')
        })

        it("마지막 페이지에서는 다른 페이지와 첫 페이지 이동, 이전 페이지 이동 버튼만 활성화", () => {
            cy.fixture('admin/approval/nextProjectList.json').then((nextProjectList) => {
                const lastProjectList = {...nextProjectList, pageInfo: {currentPage: 8, totalPages: 9}}
                cy.intercept('GET', '/api/admin/project?page=8&direction=*', {
                    statusCode: 200,
                    body: lastProjectList
                })
            }).as('getNextProjectList')
            cy.get('[data-cy="last-page-button"]').click()
            cy.get('[data-cy="first-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="page-button"]').last().should('have.class', 'bg-main-color').should('be.disabled')
            cy.get('[data-cy="page-button"]').not(':last').should('not.be.disabled')
            cy.get('[data-cy="next-page-button"]').should('be.disabled')
            cy.get('[data-cy="last-page-button"]').should('be.disabled')
        })
    })
})