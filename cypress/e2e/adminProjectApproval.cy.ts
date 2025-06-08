describe("관리자 프로젝트 승인 관리", () => {
    beforeEach(() => {
        cy.fixture('admin/approval/projectList.json').then((projectList) => {
            cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                statusCode: 200,
                body: projectList
            })
        }).as('getProjectList')

        cy.fixture('admin/approval/projectList.json').then((projectList) => {
            cy.intercept('GET', '/api/admin/project?page=0&direction=*&keyword=*', {
                statusCode: 200,
                body: projectList
            })
        }).as('getSearchProjectList')

        cy.fixture('admin/approval/nextProjectList.json').then((nextProjectList) => {
            cy.intercept('GET', '/api/admin/project?page=1&direction=*', {
                statusCode: 200,
                body: nextProjectList
            })
        }).as('getNextProjectList')

        cy.fixture('admin/approval/projectDetail.json').then((projectDetail) => {
            cy.intercept('GET', '/api/admin/project/*', {
                statusCode: 200,
                body: projectDetail
            })
        }).as('getProjectDetail')

        cy.visitMainPage();
        cy.adminLogin();
    })
    describe("프로젝트 승인 목록 조회", () => {
        it("프로젝트 승인 목록 조회 성공 케이스", () => {
            cy.visit("/admin/approval")

            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-pending-count"]').should("be.visible").should("contain", "25")
            cy.get('[data-cy="project-approval-list"]').should("be.visible")
            cy.get('[data-cy="project-approval-list-item"]').should("have.length", 10)
        })

        it("프로젝트 승인 목록 조회 성공 케이스, 데이터 없음", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=0&direction=*'
            }, {
                statusCode: 200,
                body: {
                    content: [],
                    "pageInfo": {
                        "currentPage": 0,
                        "totalPages": 0
                    },
                    "pendingCount": 0
                }
            }).as('getProjectListEmpty')

            cy.visit("/admin/approval")

            cy.wait('@getProjectListEmpty').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="project-pending-count"]').should("be.visible").should("contain", "0")
            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '승인 대기 중인 프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 프로젝트 승인 목록 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=0&direction=*'
            }, {
                statusCode: 500,
            }).as('getProjectListError')

            cy.visit("/admin/approval")

            cy.wait('@getProjectListError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 승인 목록 조회에 실패했습니다.')
        })
    })

    describe("프로젝트 승인 목록 페이지 이동 조회", () => {
        beforeEach(() => {
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)

            cy.scrollTo('bottom')

            cy.get('[data-cy="pagination"]').should('be.visible')
            cy.get('[data-cy="page-button"]').should('be.visible').should('length', 6)
            cy.get('[data-cy="page-button"]').first().should('have.class', 'bg-main-color').should('not.be.disabled');
            cy.get('[data-cy="first-page-button"]').should('be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('be.disabled')
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled')
        })

        it("프로젝트 승인 목록 페이지 이동 성공 케이스", () => {
            cy.get('[data-cy="page-button"]').eq(1).click();
            cy.wait('@getNextProjectList').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="page-button"]').eq(1).should('have.class', 'bg-main-color');
            cy.get('[data-cy="project-approval-list"]').should('be.visible')
            cy.get('[data-cy="project-approval-list-item"]').should('have.length', 10)
        })

        it("서버 오류로 인한 프로젝트 승인 목록 페이지 이동 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=1&direction=*'
            }, {
                statusCode: 500,
            }).as('getNextProjectListError')

            cy.get('[data-cy="page-button"]').eq(1).click();
            cy.wait('@getNextProjectListError').its('response.statusCode').should("eq", 500)
            cy.get('[data-cy="project-approval-list-item"]').should('have.length', 0)
            cy.get('[data-cy="page-button"]').eq(1).should('have.class', 'bg-main-color');

            cy.checkServerErrorCard('프로젝트 승인 목록 조회에 실패했습니다.')
        })
    })

    describe("프로젝트 승인 목록 정렬", () => {
        beforeEach(() => {
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="sort-select"]').should('be.visible').should('contain', "오래된순");
            cy.get('[data-cy="sort-option"]').should('be.visible').should('length', 2)
            cy.get('[data-cy="sort-option"]').eq(0).should('contain', "오래된순")
            cy.get('[data-cy="sort-option"]').eq(1).should('contain', "최신순")
        })
        it("프로젝트 승인 목록 정렬 성공 케이스", () => {
            cy.get('[data-cy="sort-select"]').should('be.visible').select('최신순')

            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approval-list"]').should('be.visible')
            cy.get('[data-cy="project-approval-list-item"]').should('have.length', 10)
            cy.get('[data-cy="sort-select"]').should('be.visible').should('contain', "최신순")
            
        })
        it("서버 오류로 인한 프로젝트 승인 목록 정렬 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=0&direction=*',
            }, {
                statusCode: 500,
            }).as('getProjectListError')

            cy.get('[data-cy="sort-select"]').should('be.visible').select("최신순")
            cy.wait('@getProjectListError').its('response.statusCode').should("eq", 500)

            cy.checkServerErrorCard('프로젝트 승인 목록 조회에 실패했습니다.')
        })
    })

    describe("프로젝트 승인 목록 검색", () => {
        beforeEach(() => {
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="search-input"]').should('be.visible').type("테스트")
        })

        it("프로젝트 승인 목록 검색 성공 케이스", () => {
            cy.get('[data-cy="search-button"]').click();
            cy.wait('@getSearchProjectList').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="project-approval-list"]').should('be.visible')
            cy.get('[data-cy="search-input"]').should('be.visible').should('have.value', "테스트")
        })

        it("프로젝트 승인 목록 검색 성공 케이스, 데이터 없음", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=0&direction=*&keyword=*',
            }, {
                statusCode: 200,
                body: {
                    content: [],
                    "pageInfo": {
                        "currentPage": 0,
                        "totalPages": 0
                    },
                    "pendingCount": 0
                }
            }).as('getSearchProjectListEmpty')

            cy.get('[data-cy="search-button"]').click();
            cy.wait('@getSearchProjectListEmpty').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="empty-message-card"]').should('be.visible')
            cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '승인 대기 중인 프로젝트가 없습니다.')
        })

        it("서버 오류로 인한 프로젝트 승인 목록 검색 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project?page=0&direction=*&keyword=*',
            }, {
                statusCode: 500,
            }).as('getSearchProjectListError')

            cy.get('[data-cy="search-button"]').click();
            cy.wait('@getSearchProjectListError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 승인 목록 조회에 실패했습니다.')
        })
    })

    describe("프로젝트 상세 조회", () => {
        beforeEach(() => {
            cy.visit("/admin/approval")
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
        })

        it("프로젝트 상세 조회 성공 케이스", () => {
            cy.get('[data-cy="project-approval-list-item"]').eq(0).click();
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)

            cy.url().should('include', '/admin/approval/project/101')
            cy.get('[data-cy="project-detail-info"]').should('be.visible')
            cy.get('[data-cy="project-detail-markdown"]').should('be.visible')
            cy.get('[data-cy="project-detail-product"]').should('be.visible')
            cy.get('[data-cy="project-approve-form"]').should('be.visible')
            cy.get('[data-cy="project-approve-radio"]').should('be.visible').should('be.enabled').should('not.be.checked')
            cy.get('[data-cy="project-reject-radio"]').should('be.visible').should('be.enabled').should('not.be.checked')
            cy.get('[data-cy="project-save-button"]').should('be.visible').should('be.disabled')
        })
        it("서버 오류로 인한 프로젝트 상세 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project/*',
            }, {
                statusCode: 500,
            }).as('getProjectDetailError')

            cy.get('[data-cy="project-approval-list-item"]').eq(0).click();
            cy.wait('@getProjectDetailError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 상세 조회에 실패했습니다.')
        })
    })

    describe("프로젝트 승인 처리", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')

            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="project-approve-radio"]').should('be.visible').should('be.enabled').should('not.be.checked')
            cy.get('[data-cy="project-reject-radio"]').should('be.visible').should('be.enabled').should('not.be.checked')
            cy.get('[data-cy="project-save-button"]').should('be.visible').should('be.disabled')
        })
        it("프로젝트 승인 처리 성공 케이스", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 200,
            }).as('updateProjectApproval')

            cy.fixture('admin/approval/projectDetail.json').then((projectDetail) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/project/101'
                }, {
                    statusCode: 200,
                    body: {
                        ...projectDetail,
                        isApproved: 'APPROVED'
                    }
                })
            })

            cy.get('[data-cy="project-approve-radio"]').click();
            cy.get('[data-cy="project-save-button"]').should('not.be.disabled').click();

            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').should('be.visible').click();

            cy.wait('@updateProjectApproval').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approve-form"]').should('not.exist')
        })
        it("서버 오류로 인한 프로젝트 승인 처리 실패 케이스", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 500,
            }).as('updateProjectApprovalError')

            cy.get('[data-cy="project-approve-radio"]').click();
            cy.get('[data-cy="project-save-button"]').should('not.be.disabled').click();

            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').should('be.visible').click();

            cy.wait('@updateProjectApprovalError').its('response.statusCode').should("eq", 500)
            cy.checkErrorTopToast('프로젝트 승인 처리 실패', '다시 시도해주세요.')
        })
    })

    describe("프로젝트 반려 처리", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')

            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)

            cy.get('[data-cy="project-approve-radio"]').should('be.visible').should('be.enabled').should('not.be.checked')
            cy.get('[data-cy="project-reject-radio"]').should('be.visible').should('be.enabled').should('not.be.checked')
            cy.get('[data-cy="project-save-button"]').should('be.visible').should('be.disabled')
        })
        it("프로젝트 반려 처리 성공 케이스", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 200,
            }).as('updateProjectReject')

            cy.fixture('admin/approval/projectDetail.json').then((projectDetail) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/project/101'
                }, {
                    statusCode: 200,
                    body: {
                        ...projectDetail,
                        isApproved: 'REJECTED'
                    }
                })
            }).as('getProjectDetail')

            cy.get('[data-cy="project-reject-radio"]').click();
            cy.get('[data-cy="project-save-button"]').should('not.be.disabled').click();

            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').should('be.visible').click();

            cy.wait('@updateProjectReject').its('response.statusCode').should("eq", 200)
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approve-form"]').should('not.exist')
        })
        it("서버 오류로 인한 프로젝트 반려 처리 실패 케이스", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 500,
            }).as('updateProjectRejectError')

            cy.get('[data-cy="project-reject-radio"]').click();
            cy.get('[data-cy="project-save-button"]').should('not.be.disabled').click();

            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').should('be.visible').click();

            cy.wait('@updateProjectRejectError').its('response.statusCode').should("eq", 500)
            cy.checkErrorTopToast('프로젝트 반려 처리 실패', '다시 시도해주세요.')

        })
    })
})