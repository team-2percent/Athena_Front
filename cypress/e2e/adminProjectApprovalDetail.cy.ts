describe("관리자 프로젝트 승인 상세 페이지", () => {
    beforeEach(() => {
        cy.fixture('admin/approval/projectDetail.json').then((projectDetail) => {
            cy.intercept('GET', '/api/admin/project/*', {
                statusCode: 200,
                body: projectDetail
            }).as('getProjectDetail')
        })

        cy.visitMainPage();
        cy.adminLogin();
    })

    describe("프로젝트 상세 정보", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
        })

        it("상세 정보 정상 표시", () => {
            cy.get('[data-cy="project-detail-info"]').should('be.visible')
            cy.get('[data-cy="project-detail-markdown"]').should('be.visible')
            cy.get('[data-cy="project-detail-product"]').should('be.visible')
        })

        it("서버 에러 시 서버에러 메시지 표시", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project/*',
            }, {
                statusCode: 500,
            }).as('getProjectDetailError')

            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetailError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 상세 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should("be.visible")
        })
    })

    describe("상품 정보", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
        })

        it("상품 정보 정상 표시", () => {
            cy.get('[data-cy="project-detail-product"]').should('be.visible')
        })

        it("서버 에러 시 서버에러 메시지 표시", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project/*',
            }, {
                statusCode: 500,
            }).as('getProjectDetailError')

            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetailError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 상세 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should("be.visible")
        })
    })

    describe("판매자 정보", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
        })

        it("판매자 정보 정상 표시", () => {
            cy.get('[data-cy="project-detail-seller"]').should('be.visible')
        })

        it("서버 에러 시 서버에러 메시지 표시", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/project/*',
            }, {
                statusCode: 500,
            }).as('getProjectDetailError')

            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetailError').its('response.statusCode').should("eq", 500)
            cy.checkServerErrorCard('프로젝트 상세 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should("be.visible")
        })
    })

    describe("승인 폼", () => {
        it("미승인 시 승인 폼 표시", () => {
            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approve-form"]').should('be.visible')
        })

        it("승인 시 승인 폼 미표시", () => {
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
                }).as('getProjectDetail')
            })

            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approve-form"]').should('not.exist')
        })
    })

    describe("승인/반려 처리", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
        })

        it("승인 버튼 클릭 시 모달 표시", () => {
            cy.get('[data-cy="project-approve-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
        })

        it("승인 로딩 중 버튼 내 스피너 표시", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 200,
                delay: 1000
            }).as('updateProjectApproval')

            cy.get('[data-cy="project-approve-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="confirm-button"]').should('have.attr', 'data-loading', 'true')
            cy.wait('@updateProjectApproval').its('response.statusCode').should("eq", 200)
        })

        it("승인 성공 시 모달 닫고 프로젝트 리로드", () => {
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

            cy.get('[data-cy="project-approve-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').click()
            cy.wait('@updateProjectApproval').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approve-modal"]').should('not.exist')
            cy.get('[data-cy="project-approve-form"]').should('not.exist')
        })

        it("승인 실패 시 모달 유지, 에러토스트 표시", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 500,
            }).as('updateProjectApprovalError')

            cy.get('[data-cy="project-approve-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').click()
            cy.wait('@updateProjectApprovalError').its('response.statusCode').should("eq", 500)
            cy.checkErrorTopToast('프로젝트 승인 처리 실패', '다시 시도해주세요.')
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="cancel-button"]').click()
            cy.get('[data-cy="project-approve-form"]').should('be.visible')
        })
    })

    describe("반려 처리", () => {
        beforeEach(() => {
            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
        })

        it("반려 모달 표시", () => {
            cy.get('[data-cy="project-reject-radio"]').click()
            cy.get('[data-cy="project-save-button"]').should('not.be.disabled').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
        })

        it("반려 로딩 중 버튼 내 스피너 표시", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 200,
                delay: 1000
            }).as('updateProjectReject')

            cy.get('[data-cy="project-reject-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="confirm-button"]').should('have.attr', 'data-loading', 'true')
            cy.wait('@updateProjectReject')
        })

        it("반려 성공 시 모달 닫고 프로젝트 리로드", () => {
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
            })

            cy.get('[data-cy="project-reject-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').click()
            cy.wait('@updateProjectReject').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="project-approve-modal"]').should('not.exist')
            cy.get('[data-cy="project-approve-form"]').should('not.exist')
        })

        it("반려 실패 시 모달 유지, 에러토스트 표시", () => {
            cy.intercept({
                method: 'PATCH',
                url: '/api/admin/project/*/approval',
            }, {
                statusCode: 500,
            }).as('updateProjectRejectError')

            cy.get('[data-cy="project-reject-radio"]').click()
            cy.get('[data-cy="project-save-button"]').click()
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="confirm-button"]').click()
            cy.wait('@updateProjectRejectError').its('response.statusCode').should("eq", 500)
            cy.checkErrorTopToast('프로젝트 반려 처리 실패', '다시 시도해주세요.')
            cy.get('[data-cy="project-approve-modal"]').should('be.visible')
            cy.get('[data-cy="cancel-button"]').click()
            cy.get('[data-cy="project-approve-form"]').should('be.visible')
        })
    })

    describe("목록 페이지 이동", () => {
        it("목록 이동", () => {
            cy.fixture('admin/approval/projectList.json').then((projectList) => {
                cy.intercept('GET', '/api/admin/project?page=0&direction=*', {
                    statusCode: 200,
                    body: projectList
                }).as('getProjectList')
            })

            cy.visit('/admin/approval/project/101')
            cy.wait('@getProjectDetail').its('response.statusCode').should("eq", 200)
            cy.get('[data-cy="back-to-list-button"]').click()
            cy.url().should('include', '/admin/approval')
            cy.wait('@getProjectList').its('response.statusCode').should("eq", 200)
        })
    })
})