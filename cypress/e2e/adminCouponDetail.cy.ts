describe('쿠폰 상세 페이지', () => {
    beforeEach(() => {
        cy.fixture('admin/coupon/couponDetail.json').then((couponDetail) => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/55'
            }, {
                statusCode: 200,
                body: couponDetail
            })
        }).as('getCouponDetail')

        cy.visitMainPage();
        cy.adminLogin();
    })

    describe('상세 조회 성공', () => {
        it('상세 정보 정상 표시', () => {
            cy.fixture('admin/coupon/couponDetail.json').then((couponDetail) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/*'
                }, {
                    statusCode: 200,
                    body: couponDetail
                })
            }).as('getCouponDetail')

            cy.visit('/admin/coupon/1')
            cy.wait('@getCouponDetail')

            // 상세 정보 표시 확인
            cy.get('[data-cy="coupon-name"]').should('be.visible')
            cy.get('[data-cy="coupon-description"]').should('be.visible')
            cy.get('[data-cy="coupon-discount-amount"]').should('be.visible')
            cy.get('[data-cy="coupon-issue-period"]').should('be.visible')
            cy.get('[data-cy="coupon-expiration-date"]').should('be.visible')
            cy.get('[data-cy="coupon-quantity"]').should('be.visible')
            cy.get('[data-cy="coupon-status"]').should('be.visible')
        })
    })

    describe('상세 조회 실패', () => {
        it('에러 메시지 표시', () => {
            cy.fixture('admin/coupon/couponDetail.json').then((couponDetail) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/*'
                }, {
                    statusCode: 500,
                    body: couponDetail
                })
            }).as('getCouponDetailError')

            cy.visit('/admin/coupon/1')
            cy.wait('@getCouponDetailError')

            // 에러 메시지 표시 확인
            cy.checkServerErrorCard('쿠폰 정보 조회에 실패했습니다.')
        })
    })

    describe('목록 페이지 이동', () => {
        it('목록 이동', () => {
            cy.fixture('admin/coupon/couponDetail.json').then((couponDetail) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/*'
                }, {
                    statusCode: 200,
                    body: couponDetail
                })
            }).as('getCouponDetail')

            cy.fixture('admin/coupon/couponList.json').then((couponList) => {
                cy.intercept('GET', '/api/admin/coupon?page=0&direction=*', {
                    statusCode: 200,
                    body: couponList
                })
            }).as('getCouponList')

            cy.visit('/admin/coupon/1')
            cy.wait('@getCouponDetail')

            // 목록으로 버튼 클릭
            cy.get('[data-cy="back-to-list-button"]').click()

            // URL 변경 확인
            cy.url().should('eq', Cypress.config().baseUrl + '/admin/coupon')
        })
    })
})
