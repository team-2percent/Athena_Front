const now = new Date()
const startAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
const endAt = new Date(startAt.getTime() + 1000 * 60 * 60);
const expireAt = new Date(endAt.getTime() + 1000 * 60 * 60 * 25);

describe('쿠폰 등록 페이지', () => {
    beforeEach(() => {
        cy.visitMainPage()
        cy.adminLogin()
        cy.visit('/admin/coupon/register')
    })

    describe('초기 화면 확인', () => {
        it('입력 필드와 버튼 표시', () => {
            // 입력 필드 확인
            cy.get('[data-cy="coupon-name-input"]').should('be.visible')
            cy.get('[data-cy="coupon-description-input"]').should('be.visible')
            cy.get('[data-cy="coupon-price-input"]').should('be.visible')
            cy.get('[data-cy="coupon-period-start-input"]').should('be.visible')
            cy.get('[data-cy="coupon-period-end-input"]').should('be.visible')
            cy.get('[data-cy="coupon-expiration-input"]').should('be.visible')
            cy.get('[data-cy="coupon-stock-input"]').should('be.visible')

            // 버튼 확인
            cy.get('[data-cy="coupon-submit-button"]').should('be.visible')
        })
    })

    describe('입력값 유효성 검증', () => {
        describe('정상 입력 시 등록 가능', () => {
            it('모든 필수값 입력 시 버튼 활성화', () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰')
                cy.get('[data-cy="coupon-description-input"]').type('10자 이상의 테스트 쿠폰 설명')
                cy.get('[data-cy="coupon-price-input"]').type('10000')
                cy.get('[data-cy="coupon-stock-input"]').type('100')

                cy.get('[data-cy="coupon-submit-button"]').should('not.be.disabled')
            })
        })

        describe('필수값 미입력', () => {
            it('쿠폰명 미입력 시 버튼 비활성화', () => {
                cy.get('[data-cy="coupon-description-input"]').type('10자 이상의 테스트 쿠폰 설명')
                cy.get('[data-cy="coupon-price-input"]').type('10000')
                cy.get('[data-cy="coupon-stock-input"]').type('100')

                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled')
            })

            it('쿠폰 설명 미입력 시 버튼 비활성화', () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰')
                cy.get('[data-cy="coupon-price-input"]').type('10000')
                cy.get('[data-cy="coupon-stock-input"]').type('100')

                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled')
            })

            it('가격 0 입력 시 버튼 비활성화', () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰')
                cy.get('[data-cy="coupon-description-input"]').type('10자 이상의 테스트 쿠폰 설명')
                cy.get('[data-cy="coupon-price-input"]').type('0')
                cy.get('[data-cy="coupon-stock-input"]').type('100')

                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled')
            })

            it('수량 0 입력 시 버튼 비활성화', () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰')
                cy.get('[data-cy="coupon-description-input"]').type('10자 이상의 테스트 쿠폰 설명')
                cy.get('[data-cy="coupon-price-input"]').type('10000')
                cy.get('[data-cy="coupon-stock-input"]').type('0')

                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled')
            })
        })

        describe('필수값 오류', () => {
            it('쿠폰명 제한 초과 시 에러 메시지 표시', () => {
                cy.get('[data-cy="coupon-name-input"]').type('a'.repeat(51))
                cy.get('[data-cy="coupon-name-error"]').should('be.visible')
                    .and('contain', '쿠폰 이름은 25자 이내로 입력해주세요.')
            })

            it('설명 제한 초과 시 에러 메시지 표시', () => {
                cy.get('[data-cy="coupon-description-input"]').type('a'.repeat(201))
                cy.get('[data-cy="coupon-description-error"]').should('be.visible')
                    .and('contain', '쿠폰 설명은 50자 이내로 입력해주세요.')
            })

            it('가격 제한 초과 시 에러 메시지 표시', () => {
                cy.get('[data-cy="coupon-price-input"]').type('50001')
                cy.get('[data-cy="coupon-price-error"]').should('be.visible')
                    .and('contain', '쿠폰 가격은 50000원 이내로 입력해주세요.')
            })

            it('기간 시작 시간이 종료 시간보다 늦을 경우 에러 메시지 표시', () => {
                const newStartAt = new Date(startAt.getTime() + 1000 * 60 * 60 * 25);
                cy.get('[data-cy="coupon-period-start-input"]').click();

                cy.get('button')
                .filter(`:contains(${newStartAt.getDate()})`)     
                .not(':disabled')                    
                .first()                              
                .click();

                cy.get('[data-cy="coupon-period-error"]').should('be.visible')
                    .and('contain', '발급 기간은 최소 1시간 이상이어야 합니다.')
            })

            it('기간 종료 시간이 만료 시간보다 늦을 경우 에러 메시지 표시', () => {
                const newExpireAt = new Date(expireAt.getTime() + 1000 * 60 * 60 * 25);
                cy.get('[data-cy="coupon-period-end-input"]').click();

                cy.get('button')
                .filter(`:contains(${newExpireAt.getDate()})`)     
                .not(':disabled')                    
                .first()                              
                .click();

                cy.get('[data-cy="coupon-expiration-error"]').should('be.visible')
                    .and('contain', '만료 기간은 발급 종료일로부터 최소 24시간 이상이어야 합니다.')
            })

            it('수량 제한 초과 시 에러 메시지 표시', () => {
                cy.get('[data-cy="coupon-stock-input"]').type('1000001')
                cy.get('[data-cy="coupon-stock-error"]').should('be.visible')
                    .and('contain', '쿠폰 수량은 1000000개 이내로 입력해주세요.')
            })
        })
    })

    describe('쿠폰 등록', () => {
        beforeEach(() => {
            cy.fixture('admin/coupon/couponList.json').then((couponList) => {
                cy.intercept('GET', '/api/admin/couponList?size=10&page=0', {
                    statusCode: 200,
                    body: couponList
                }).as('getCouponList')
            })

            // 유효한 폼 작성
            cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰')
            cy.get('[data-cy="coupon-description-input"]').type('10자 이상의 테스트 쿠폰 설명')
            cy.get('[data-cy="coupon-price-input"]').type('10000')
            cy.get('[data-cy="coupon-stock-input"]').type('100')
        })

        it('쿠폰 등록 로딩 상태 확인', () => {
            cy.intercept('POST', '/api/coupon/create', {
                statusCode: 200,
                delay: 1000
            }).as('addCoupon')

            cy.get('[data-cy="coupon-submit-button"]').click()
            cy.get('[data-cy="confirm-button"]').click()

            cy.get('[data-cy="confirm-button-loading"]').should('be.visible')
        })

        it('쿠폰 등록 성공 시 목록 페이지로 이동', () => {
            cy.intercept('POST', '/api/coupon/create', {
                statusCode: 200,
            }).as('addCoupon')

            cy.get('[data-cy="coupon-submit-button"]').click()
            cy.get('[data-cy="confirm-button"]').click()

            cy.wait('@addCoupon')
            cy.url().should('eq', Cypress.config().baseUrl + '/admin/coupon')
        })

        it('쿠폰 등록 실패 시 에러 메시지 표시', () => {
            cy.intercept('POST', '/api/coupon/create', {
                statusCode: 500
            }).as('addCouponError')

            cy.get('[data-cy="coupon-submit-button"]').click()
            cy.get('[data-cy="confirm-button"]').click()

            cy.checkErrorTopToast('쿠폰 등록 실패', '다시 시도해 주세요.')
            cy.get('[data-cy="coupon-confirm-modal"]').should('be.visible')
        })
    })

    describe('목록 페이지 이동', () => {
        it('목록으로 버튼 클릭 시 목록 페이지로 이동', () => {
            cy.fixture('admin/coupon/couponList.json').then((couponList) => {
                cy.intercept('GET', '/api/admin/couponList?size=10&page=0', {
                    statusCode: 200,
                    body: couponList
                }).as('getCouponList')
            })

            cy.get('[data-cy="back-to-list-button"]').click()

            cy.wait('@getCouponList')
            cy.url().should('eq', Cypress.config().baseUrl + '/admin/coupon')
        })
    })
})
