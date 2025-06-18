describe('쿠폰 목록 페이지', () => {
    beforeEach(() => {
        cy.fixture('admin/coupon/couponList.json').then((couponList) => {
            cy.intercept('GET', '/api/admin/couponList?size=10&page=*', {
                statusCode: 200,
                body: couponList
            }).as('getCouponList')
        })

        cy.visitMainPage();
        cy.adminLogin();
        
    })

    describe('쿠폰 목록', () => {
        it('정상 조회 시 쿠폰 목록 정상 표시', () => {
            cy.visit('/admin/coupon')
            cy.wait('@getCouponList').its('response.statusCode').should('eq', 200)

            // 쿠폰 목록 표시 확인
            cy.get('[data-cy="coupon-list"]').should('be.visible')
            
            // 쿠폰 정보 표시 확인
            cy.get('[data-cy="coupon-name"]').should('be.visible')
            cy.get('[data-cy="coupon-price"]').should('be.visible')
            cy.get('[data-cy="coupon-period"]').should('be.visible')
            cy.get('[data-cy="coupon-expiration-date"]').should('be.visible')
            cy.get('[data-cy="coupon-amount"]').should('be.visible')
            cy.get('[data-cy="coupon-status"]').should('be.visible')

            // 쿠폰 개수 확인
            cy.get('[data-cy="coupon-list-item"]').should('have.length', 10)
        })

        it('서버 에러 시 서버에러 메시지 표시', () => {
            cy.intercept('GET', '/api/admin/couponList?size=10&page=*', {
                statusCode: 500
            }).as('getCouponListError')

            cy.visit('/admin/coupon')
            cy.wait('@getCouponListError').its('response.statusCode').should('eq', 500)

            cy.checkServerErrorCard('쿠폰 목록 조회에 실패했습니다.')
            cy.get('[data-cy="retry-button"]').should('be.visible')
        })
    })

    describe('상태 필터', () => {
        beforeEach(() => {
            cy.visit('/admin/coupon')
            cy.wait('@getCouponList').its('response.statusCode').should('eq', 200)
        })

        it('상태 select 표시', () => {
            cy.get('[data-cy="status-select"]').should('be.visible')
                .and('contain', '전체')
            
            cy.get('[data-cy="status-select"]').select('전체')
            
            // 상태 옵션 확인
            cy.get('[data-cy="status-select"] option').should('have.length', 5)
            cy.get('[data-cy="status-select"] option').eq(0).should('have.value', 'ALL')
            cy.get('[data-cy="status-select"] option').eq(1).should('have.value', 'PREVIOUS')
            cy.get('[data-cy="status-select"] option').eq(2).should('have.value', 'IN_PROGRESS')
            cy.get('[data-cy="status-select"] option').eq(3).should('have.value', 'COMPLETED')
            cy.get('[data-cy="status-select"] option').eq(4).should('have.value', 'ENDED')
        })

        it('상태 현재 상태 클릭 시 요청 없음', () => {
            cy.get('[data-cy="status-select"]').select('전체')
            cy.get('[data-cy="status-select"]').should('have.value', 'ALL')
        })

        it('상태 다른 상태 클릭 시 리로드', () => {
            cy.fixture('admin/coupon/couponList.json').then((couponList) => {
                const filteredCouponListContent = couponList.content.filter((coupon: any) => coupon.status === 'IN_PROGRESS')
                cy.intercept('GET', '/api/admin/couponByStatus?size=10&page=0&status=IN_PROGRESS', {
                    statusCode: 200,
                    body: {
                        content: filteredCouponListContent,
                        page: {
                            totalElements: filteredCouponListContent.length,
                            totalPages: 1,
                            size: 10,
                            number: 0
                        } 
                    }
                }).as('getIssuingCouponList')
            })

            cy.get('[data-cy="status-select"]').select('IN_PROGRESS')
            
            cy.wait('@getIssuingCouponList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="status-select"]').should('have.value', 'IN_PROGRESS')
        })
    })

    describe('페이지 사이즈', () => {
        beforeEach(() => {
            cy.visit('/admin/coupon')
            cy.wait('@getCouponList').its('response.statusCode').should('eq', 200)
        })

        it('페이지 사이즈 select 표시', () => {
            cy.get('[data-cy="page-size-select"]').should('be.visible')
                .and('contain', '10개씩')
            
            cy.get('[data-cy="page-size-select"]').select('10')
            
            // 페이지 사이즈 옵션 확인
            cy.get('[data-cy="page-size-select"] option').should('have.length', 3)
            cy.get('[data-cy="page-size-select"] option').eq(0).should('have.value', '10')
            cy.get('[data-cy="page-size-select"] option').eq(1).should('have.value', '20')
            cy.get('[data-cy="page-size-select"] option').eq(2).should('have.value', '50')
        })

        it('페이지 사이즈 현재 상태 클릭 시 요청 없음', () => {
            cy.get('[data-cy="page-size-select"]').select('10')
            cy.get('[data-cy="page-size-select"]').should('have.value', '10')
        })

        it('페이지 사이즈 다른 상태 클릭 시 리로드', () => {
            cy.fixture('admin/coupon/couponList20.json').then((couponList) => {
                cy.intercept('GET', '/api/admin/couponList?size=20&page=0', {
                    statusCode: 200,
                    body: couponList
                }).as('getCouponListWithSize20')
            })
        
            cy.get('[data-cy="page-size-select"]').select('20')
            
            cy.wait('@getCouponListWithSize20').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="page-size-select"]').should('have.value', '20')
            cy.get('[data-cy="coupon-list-item"]').should('have.length', 20)
        })
    })

    describe('페이지네이션', () => {
        beforeEach(() => {
            cy.visit('/admin/coupon')
            cy.wait('@getCouponList').its('response.statusCode').should('eq', 200)
        })

        it('첫 페이지에서는 다른 페이지와 마지막 페이지 이동, 다음 페이지 이동 버튼만 활성화', () => {
            cy.scrollTo('bottom')
            
            cy.get('[data-cy="pagination"]').should('be.visible')
            cy.get('[data-cy="first-page-button"]').should('be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('be.disabled')
            cy.get('[data-cy="page-button"]').eq(0).should('be.disabled')
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled')
        })

        it('중간 페이지에서는 현재 페이지 제외 모두 활성화', () => {
            cy.fixture('admin/coupon/couponList.json').then((couponList) => {
                const newCouponList = couponList
                newCouponList.page.number = 1
                cy.intercept('GET', '/api/admin/couponList?size=10&page=1', {
                    statusCode: 200,
                    body: newCouponList
                }).as('getCouponListPage2')
            })

            cy.scrollTo('bottom')
            cy.get('[data-cy="page-button"]').eq(1).click()
            
            cy.get('[data-cy="first-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="page-button"]').eq(1).should('be.disabled')
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled')
        })

        it('마지막 페이지에서는 다른 페이지와 첫 페이지 이동, 이전 페이지 이동 버튼만 활성화', () => {
            cy.fixture('admin/coupon/couponList20.json').then((couponList) => {
                const newCouponList = couponList
                newCouponList.page.number = newCouponList.page.totalPages - 1
                cy.intercept('GET', '/api/admin/couponList?size=10&page=5', {
                    statusCode: 200,
                    body: newCouponList
                }).as('getCouponListLastPage')
            })

            cy.scrollTo('bottom')
            cy.get('[data-cy="last-page-button"]').click()

            cy.wait('@getCouponListLastPage').its('response.statusCode').should('eq', 200)
        
            cy.get('[data-cy="first-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="prev-page-button"]').should('not.be.disabled')
            cy.get('[data-cy="page-button"]').eq(2).should('be.disabled')
            cy.get('[data-cy="next-page-button"]').should('be.disabled')
            cy.get('[data-cy="last-page-button"]').should('be.disabled')
        })

        it('상세 페이지 진입', () => {
            cy.intercept('GET', '/api/admin/*', {
                statusCode: 200,
                body: {}
            }).as('getCouponDetail')

            cy.get('[data-cy="coupon-list-item"]').first().click()
            
            cy.wait('@getCouponDetail').its('response.statusCode').should('eq', 200)
            cy.url().should('include', '/admin/coupon/')
        })

        it('등록 페이지 진입', () => {
            cy.get('[data-cy="coupon-register-button"]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/admin/coupon/register')
        })
    })
})