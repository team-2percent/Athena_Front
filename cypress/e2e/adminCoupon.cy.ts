describe("관리자 쿠폰 관리", () => {
    beforeEach(() => {
        cy.fixture('admin/coupon/couponList.json').then((couponList) => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=10&page=0'
            }, {
                statusCode: 200,
                body: couponList
            })
        }).as('getCouponList')

        cy.fixture('admin/coupon/nextCouponList.json').then((couponList) => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=10&page=1'
            }, {
                statusCode: 200,
                body: couponList
            })
        }).as('getNextCouponList')

        cy.fixture('admin/coupon/couponListEnded.json').then((couponList) => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponByStatus?size=10&page=0&status=ENDED'
            }, {
                statusCode: 200,
                body: couponList
            })
        }).as('getCouponListEnded')

        cy.fixture('admin/coupon/couponList20.json').then((couponList) => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=20&page=0'
            }, {
                statusCode: 200,
                body: couponList
            })
        }).as('getCouponList20')

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

    describe("쿠폰 목록 조회", () => {
        it("쿠폰 목록 조회 성공 케이스", () => {
            cy.visit('/admin/coupon');
            cy.wait('@getCouponList').its('response.statusCode').should("eq", 200);
            cy.get('[data-cy="coupon-list"]').should('exist');
            cy.get('[data-cy="coupon-list-item"]').should('have.length.at.least', 1);
        })

        it("쿠폰 목록 조회 성공 케이스, 데이터 없음", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=10&page=0'
            }, {
                statusCode: 200,
                body: { content: [], page: {
                    "size": 10,
                    "number": 0,
                    "totalElements": 0,
                    "totalPages": 0
                  }}
            }).as('getEmptyCouponList');
            
            cy.visit('/admin/coupon');
            cy.wait('@getEmptyCouponList').its('response.statusCode').should("eq", 200);
            cy.checkEmptyMessageCard("쿠폰이 없습니다.");
        })

        it("서버 오류로 인한 쿠폰 목록 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=10&page=0'
            }, {
                statusCode: 500
            }).as('getCouponListError');
            
            cy.visit('/admin/coupon');
            cy.wait('@getCouponListError').its('response.statusCode').should("eq", 500);
            cy.checkServerErrorCard("쿠폰 목록 조회에 실패했습니다.");
        })
    })

    describe("쿠폰 목록 페이지 이동 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/coupon');
            cy.wait('@getCouponList').its('response.statusCode').should("eq", 200);
        })
        it("쿠폰 목록 페이지 이동 성공 케이스", () => {
            cy.get('[data-cy="next-page-button"]').click();
            cy.wait('@getNextCouponList').its('response.statusCode').should("eq", 200);
            cy.get('[data-cy="coupon-list"]').should('exist');
            cy.get('[data-cy="coupon-list-item"]').should('have.length.at.least', 1);
        })

        it("서버 오류로 인한 쿠폰 목록 페이지 이동 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=10&page=1'
            }, {
                statusCode: 500
            }).as('getNextCouponListError');
            
            cy.get('[data-cy="next-page-button"]').click();
            cy.wait('@getNextCouponListError').its('response.statusCode').should("eq", 500);
            cy.checkServerErrorCard("쿠폰 목록 조회에 실패했습니다.");
        })
    })

    describe("쿠폰 목록 상태 필터 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/coupon');
            cy.wait('@getCouponList').its('response.statusCode').should("eq", 200);
        })
        it("쿠폰 목록 상태 필터 조회 성공 케이스", () => {
            cy.get('[data-cy="status-filter"]').select('ENDED');
            cy.wait('@getCouponListEnded');
            cy.get('[data-cy="coupon-list-item"]').should('have.length.at.least', 1);
        })

        it("쿠폰 목록 상태 필터 조회 성공 케이스, 데이터 없음", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponByStatus?size=10&page=0&status=ENDED'
            }, {
                statusCode: 200,
                body: { content: [], page: {
                    "size": 10,
                    "number": 0,
                    "totalElements": 0,
                    "totalPages": 0
                  }}
            }).as('getEmptyCouponListEnded');
            
            cy.get('[data-cy="status-filter"]').select('ENDED');
            cy.wait('@getEmptyCouponListEnded').its('response.statusCode').should("eq", 200);
            cy.checkEmptyMessageCard("쿠폰이 없습니다.");
        })

        it("서버 오류로 인한 쿠폰 목록 상태 필터 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponByStatus?size=10&page=0&status=ENDED'
            }, {
                statusCode: 500
            }).as('getCouponListEndedError');
            
            cy.get('[data-cy="status-filter"]').select('ENDED');
            cy.wait('@getCouponListEndedError').its('response.statusCode').should("eq", 500);
            cy.checkServerErrorCard("쿠폰 목록 조회에 실패했습니다.");
        })
    })

    describe("쿠폰 목록 페이지 사이즈 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/coupon');
            cy.wait('@getCouponList').its('response.statusCode').should("eq", 200);
        })
        it("쿠폰 목록 페이지 사이즈 조회 성공 케이스", () => {
            cy.get('[data-cy="page-size-selector"]').select('20');
            cy.wait('@getCouponList20').its('response.statusCode').should("eq", 200);
            cy.get('[data-cy="coupon-list-item"]').should('have.length.at.least', 1);
        })

        it("서버 오류로 인한 쿠폰 목록 페이지 사이즈 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/couponList?size=20&page=0'
            }, {
                statusCode: 500
            }).as('getCouponList20Error');

            cy.get('[data-cy="page-size-selector"]').select('20');
            cy.wait('@getCouponList20Error').its('response.statusCode').should("eq", 500);
            cy.checkServerErrorCard("쿠폰 목록 조회에 실패했습니다.");
        })
    })

    describe("쿠폰 상세 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/coupon');
            cy.wait('@getCouponList').its('response.statusCode').should("eq", 200);
        })
        it("쿠폰 상세 조회 성공 케이스", () => {
            cy.get('[data-cy="coupon-list-item"]').first().click();
            cy.url().should('include', '/admin/coupon/');
            cy.wait('@getCouponDetail').its('response.statusCode').should("eq", 200);
            cy.get('[data-cy="coupon-detail"]').should('exist');
        })

        it("서버 오류로 인한 쿠폰 상세 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/*'
            }, {
                statusCode: 500
            }).as('getCouponDetailError');

            cy.get('[data-cy="coupon-list-item"]').first().click();
            cy.url().should('include', '/admin/coupon/');
            cy.wait('@getCouponDetailError').its('response.statusCode').should("eq", 500);
            cy.checkServerErrorCard("쿠폰 정보 조회에 실패했습니다.");
        })
    })

    describe("쿠폰 등록", () => {
        beforeEach(() => {
            cy.visit('/admin/coupon/register');
            cy.get('[data-cy="coupon-submit-button"]').should('be.disabled');
        })
        it("유효한 폼 작성 후 쿠폰 등록 성공 케이스", () => {
            cy.intercept({
                method: 'POST',
                url: '/api/coupon/create'
            }, {
                statusCode: 200
            }).as('createCouponSuccess');
            cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰');
            cy.get('[data-cy="coupon-description-input"]').type('테스트 쿠폰 설명을 작성합니다.');
            cy.get('[data-cy="coupon-price-input"]').type('1000');
            cy.get('[data-cy="coupon-stock-input"]').type('100');
            cy.get('[data-cy="coupon-submit-button"]').should('be.enabled').click();

            cy.get('[data-cy="coupon-confirm-modal"]').should('be.visible');
            cy.get('[data-cy="confirm-button"]').should('be.enabled').click();

            cy.wait('@createCouponSuccess').its('response.statusCode').should("eq", 200);
            cy.url().should('include', '/admin/coupon');

            cy.fixture('admin/coupon/couponList.json').then((couponList) => {
                const newCouponList = {
                    ...couponList,
                    content: [
                        {
                            "id": 1000,
                            "title": "테스트 쿠폰",
                            "stock": 100,
                            "price": 1000,
                            "status": "ACTIVE",
                            "startAt": "2025-06-02T12:00:00",
                            "endAt": "2025-06-02T17:00:00",
                            "expiresAt": "2025-06-03T17:00:00"
                          },
                        ...couponList.content,
                    ]
                }
                cy.intercept('GET', '/api/admin/couponList?size=10&page=0', {
                    statusCode: 200,
                    body: newCouponList
                })
            }).as('getCouponList')
            
            cy.wait('@getCouponList').its('response.statusCode').should("eq", 200);
        })

        describe("쿠폰 등록 불가 케이스", () => {
            it("쿠폰명 미입력", () => {
                cy.get('[data-cy="coupon-description-input"]').type('테스트 쿠폰 설명을 작성합니다.');
                cy.get('[data-cy="coupon-price-input"]').type('1000');
                cy.get('[data-cy="coupon-stock-input"]').type('100');
                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled');
            })

            it("쿠폰 설명 미입력", () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰');
                cy.get('[data-cy="coupon-price-input"]').type('1000');
                cy.get('[data-cy="coupon-stock-input"]').type('100');
                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled')
            })

            it("가격이 1000원 미만", () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰');
                cy.get('[data-cy="coupon-description-input"]').type('테스트 쿠폰 설명을 작성합니다.');
                cy.get('[data-cy="coupon-price-input"]').type('999');
                cy.get('[data-cy="coupon-stock-input"]').type('100');
                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled');
            })

            it("재고가 0개 이하", () => {
                cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰');
                cy.get('[data-cy="coupon-description-input"]').type('테스트 쿠폰 설명을 작성합니다.');
                cy.get('[data-cy="coupon-price-input"]').type('1000');
                cy.get('[data-cy="coupon-stock-input"]').type('0');
                cy.get('[data-cy="coupon-submit-button"]').should('be.disabled');
            })
        })

        it("서버 오류로 인한 쿠폰 등록 실패 케이스", () => {
            cy.intercept({
                method: 'POST',
                url: '/api/coupon/create'
            }, {
                statusCode: 500
            }).as('createCouponError');
            
            cy.get('[data-cy="coupon-name-input"]').type('테스트 쿠폰');
            cy.get('[data-cy="coupon-description-input"]').type('테스트 쿠폰 설명을 작성합니다.');
            cy.get('[data-cy="coupon-price-input"]').type('1000');
            cy.get('[data-cy="coupon-stock-input"]').type('100');
            cy.get('[data-cy="coupon-submit-button"]').click();

            cy.get('[data-cy="coupon-confirm-modal"]').should('be.visible');
            cy.get('[data-cy="confirm-button"]').should('be.enabled').click();

            cy.wait('@createCouponError').its('response.statusCode').should("eq", 500);
            cy.url().should('include', '/admin/coupon/register');
            cy.checkErrorTopToast("쿠폰 등록 실패", "다시 시도해 주세요.");
        })
    })
})