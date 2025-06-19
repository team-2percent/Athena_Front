describe('정산 상세 페이지', () => {
    const settlementId = '1'

    beforeEach(() => {
        cy.fixture('admin/settlement/settlementDetailInfo.json').then((settlementDetail) => {
            cy.intercept({
                method: 'GET',
                url: `/api/admin/settlement/${settlementId}/info`
            }, {
                statusCode: 200,
                body: settlementDetail
            }).as('getSettlementDetail')
        })

        cy.fixture('admin/settlement/settlementDetailProductSummary.json').then((productList) => {
            cy.intercept({
                method: 'GET',
                url: `/api/admin/settlement/${settlementId}/product-summary`
            }, {
                statusCode: 200,
                body: productList
            }).as('getSettlementProducts')
        })

        cy.fixture('admin/settlement/settlementDetailHistory.json').then((historyList) => {
            cy.intercept({
                method: 'GET',
                url: `/api/admin/settlement/${settlementId}/history`
            }, {
                statusCode: 200,
                body: historyList
            }).as('getSettlementHistory')
        })

        cy.visitMainPage()
        cy.adminLogin()
    })

    describe('상세 정보 조회', () => {
        it('조회 성공 시 상세 정보 정상 표시', () => {
            cy.visit(`/admin/settlement/${settlementId}`)

            cy.wait('@getSettlementDetail').its('response.statusCode').should('eq', 200)

            // 정산 상세 정보 표시 확인
            cy.get('[data-cy="settlement-detail-project-title"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-target-amount"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-funding-period"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-plan-name"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-total-sales"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-platform-fee"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-pg-fee"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-vat"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-payout-amount"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-total-count"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-buyer-count"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-settled-at"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-status"]').should('be.visible')
            cy.get('[data-cy="settlement-detail-bank-account"]').should('be.visible')
        })

        it('서버 에러로 인한 조회 실패 시 에러 메시지 표시', () => {
            cy.intercept({
                method: 'GET',
                url: `/api/admin/settlement/${settlementId}/info`
            }, {
                statusCode: 500
            }).as('getSettlementDetailError')

            cy.visit(`/admin/settlement/${settlementId}`)

            cy.wait('@getSettlementDetailError').its('response.statusCode').should('eq', 500)
            cy.checkServerErrorCard('정산 정보 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should('be.visible')
        })
    })

    describe('상품 정보 조회', () => {
        it('조회 성공 시 상품 정보 정상 표시', () => {
            cy.visit(`/admin/settlement/${settlementId}`)

            cy.wait('@getSettlementProducts').its('response.statusCode').should('eq', 200)

            // 상품 리스트 표시 확인
            cy.get('[data-cy="settlement-detail-product-list"]').should('exist')
            cy.get('[data-cy="settlement-product-summary-total-row"]').should('exist')

            // 상품 정보 표시 확인
            cy.get('[data-cy="settlement-product-summary-product-row"]').first().within(() => {
                cy.get('[data-cy="settlement-product-summary-product-name"]').should('exist')
                cy.get('[data-cy="settlement-product-summary-product-quantity"]').should('exist')
                cy.get('[data-cy="settlement-product-summary-product-total-price"]').should('exist')
                cy.get('[data-cy="settlement-product-summary-product-payout-amount"]').should('exist')
                cy.get('[data-cy="settlement-product-summary-product-platform-fee"]').should('exist')
                cy.get('[data-cy="settlement-product-summary-product-pg-fee"]').should('exist')
                cy.get('[data-cy="settlement-product-summary-product-vat"]').should('exist')
            })
        })

        it('서버 에러로 인한 조회 실패 시 에러 메시지 표시', () => {
            cy.intercept({
                method: 'GET',
                url: `/api/admin/settlement/${settlementId}/product-summary`
            }, {
                statusCode: 500
            }).as('getSettlementProductsError')

            cy.visit(`/admin/settlement/${settlementId}`)

            cy.wait('@getSettlementProductsError').its('response.statusCode').should('eq', 500)
            cy.checkServerErrorCard('정산 정보 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should('be.visible')
        })
    })

    describe('정산 이력 조회', () => {
        it('조회 성공 시 정산 이력 정상 표시', () => {
            cy.visit(`/admin/settlement/${settlementId}`)

            // 이력 리스트 표시 확인
            cy.get('[data-cy="settlement-history-list"]').should('exist')

            // 이력 정보 표시 확인
            cy.get('[data-cy="settlement-history-item"]').first().within(() => {
                cy.get('[data-cy="settlement-history-product-name"]').should('exist')
                cy.get('[data-cy="settlement-history-quantity"]').should('exist')
                cy.get('[data-cy="settlement-history-total-price"]').should('exist')
                cy.get('[data-cy="settlement-history-platform-fee"]').should('exist')
                cy.get('[data-cy="settlement-history-pg-fee"]').should('exist')
                cy.get('[data-cy="settlement-history-vat"]').should('exist')
                cy.get('[data-cy="settlement-history-amount"]').should('exist')
                cy.get('[data-cy="settlement-history-ordered-at"]').should('exist')
            })
        })

        it('서버 에러로 인한 조회 실패 시 에러 메시지 표시', () => {
            cy.intercept({
                method: 'GET',
                url: `/api/admin/settlement/${settlementId}/history`
            }, {
                statusCode: 500
            }).as('getSettlementHistoryError')

            cy.visit(`/admin/settlement/${settlementId}`)

            cy.wait('@getSettlementHistoryError').its('response.statusCode').should('eq', 500)
            cy.checkServerErrorCard('정산 정보 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should('be.visible')
        })
    })

    describe('목록 페이지 이동', () => {
        it('목록으로 버튼 클릭 시 목록 페이지로 이동', () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/settlement'
                }, {
                    statusCode: 200,
                    body: settlementList
                }).as('getSettlementList')
            })

            cy.visit(`/admin/settlement/${settlementId}`)

            cy.wait('@getSettlementHistory').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="back-to-list-button"]').click()

            cy.wait('@getSettlementList').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/admin/settlement')
        })
    })
})
