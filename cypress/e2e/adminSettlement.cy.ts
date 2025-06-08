describe("관리자 정산 관리", () => {
    beforeEach(() => {
        cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
            cy.intercept('GET', '/api/admin/settlement', {
                statusCode: 200,
                body: settlementList
            })
        }).as('getSettlementList')

        cy.fixture('admin/settlement/settlementListCompleted.json').then((settlementList) => {
            cy.intercept('GET', '/api/admin/settlement?status=COMPLETED', {
                statusCode: 200,
                body: settlementList
            })
        }).as('getSettlementListCompleted')

        cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
            cy.intercept('GET', '/api/admin/settlement?year=2025', {
                statusCode: 200,
                body: settlementList
            })
        }).as('getSettlementListYear')

        cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
            cy.intercept('GET', '/api/admin/settlement?year=2025&month=6', {
                statusCode: 200,
                body: settlementList
            })
        }).as('getSettlementListYearMonth')

        cy.fixture('admin/settlement/settlementDetailInfo.json').then((settlementDetailInfo) => {
            cy.intercept('GET', '/api/admin/settlement/*/info', {
                statusCode: 200,
                body: settlementDetailInfo
            })
        }).as('getSettlementDetailInfo')

        cy.fixture('admin/settlement/settlementDetailProductSummary.json').then((settlementDetailProduct) => {
            cy.intercept('GET', '/api/admin/settlement/*/product-summary', {
                statusCode: 200,
                body: settlementDetailProduct
            })
        }).as('getSettlementDetailProduct')


        cy.fixture('admin/settlement/settlementDetailHistory.json').then((settlementDetailHistory) => {
            cy.intercept('GET', '/api/admin/settlement/*/history', {
                statusCode: 200,
                body: settlementDetailHistory
            })
        }).as('getSettlementDetailHistory')

        cy.visitMainPage();
        cy.adminLogin();
    })

    describe("정산 목록 조회", () => {
        it("정산 목록 조회 성공 케이스", () => {
            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList');
            cy.get('[data-cy="settlement-list"]').should('exist');
            cy.get('[data-cy="settlement-list-item"]').should('have.length.at.least', 1);
        })

        it("정산 목록 조회 성공 케이스, 데이터 없음", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/settlement'
            }, {
                statusCode: 200,
                body: { content: [], pageInfo: { currentPage: 0, totalPages: 0 } }
            }).as('getEmptySettlementList');
            
            cy.visit('/admin/settlement');
            cy.wait('@getEmptySettlementList');
            cy.checkEmptyMessageCard("정산 내역이 없습니다.");
        })

        it("서버 오류로 인한 정산 목록 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/settlement'
            }, {
                statusCode: 500,
            }).as('getSettlementListError');
            
            cy.visit('/admin/settlement');
            cy.wait('@getSettlementListError');
            cy.checkServerErrorCard("정산 내역 조회에 실패했습니다.");
        })
    })

    describe("상태 필터 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should("eq", 200);
        })

        it("상태 필터 조회 성공 케이스", () => {
            cy.get('[data-cy="status-filter"]').select('COMPLETED');
            cy.wait('@getSettlementListCompleted');
            cy.get('[data-cy="settlement-list-item"]').should('have.length.at.least', 1);
        })

        it("서버 오류로 인한 상태 필터 조회 실패 케이스", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/settlement?status=COMPLETED'
            }, {
                statusCode: 500,
                body: { message: '서버 오류가 발생했습니다.' }
            }).as('getSettlementListCompletedError');
 
            cy.get('[data-cy="status-filter"]').select('COMPLETED');
            cy.wait('@getSettlementListCompletedError');
            cy.checkServerErrorCard("정산 내역 조회에 실패했습니다.");
        })
    })

    describe("날짜 필터 상세 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should("eq", 200);
        })

        it("날짜 필터 상세 조회 성공 케이스(년도)", () => {
            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear');
            cy.get('[data-cy="year-filter"]').should('contain', '2025')
            cy.get('[data-cy="month-filter"]').should('be.visible')
            cy.get('[data-cy="settlement-list-item"]').should('have.length.at.least', 1);
        })

        it("날짜 필터 상세 조회 성공 케이스(년도, 월)", () => {
            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear');
            cy.get('[data-cy="month-filter"]').should('be.visible')
            cy.get('[data-cy="month-filter"]').select('6');
            cy.wait('@getSettlementListYearMonth');
            cy.get('[data-cy="year-filter"]').should('contain', '2025')
            cy.get('[data-cy="month-filter"]').should('contain', '6')
            cy.get('[data-cy="settlement-list-item"]').should('have.length.at.least', 1);
        })

        it("서버 오류로 인한 날짜 필터 상세 조회 실패 케이스", () => {
            cy.intercept('GET', '/api/admin/settlement?year=2025&month=6', {
                statusCode: 500,
                body: { message: '서버 오류가 발생했습니다.' }
            }).as('getSettlementListYearMonthError');

            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear');
            cy.get('[data-cy="month-filter"]').select('6');
            cy.wait('@getSettlementListYearMonthError');
            cy.get('[data-cy="year-filter"]').should('contain', '2025')
            cy.get('[data-cy="month-filter"]').should('contain', '6')
            cy.checkServerErrorCard("정산 내역 조회에 실패했습니다.");
        })
    })

    describe("정산 상세 조회", () => {
        beforeEach(() => {
            cy.visit('/admin/settlement');
            cy.get('[data-cy="settlement-list-item"]').first().click();
        })
        describe("정산 상세 정보 조회", () => {
            it("정산 상세 정보 조회 성공 케이스", () => {
                cy.wait('@getSettlementDetailInfo').its('response.statusCode').should("eq", 200);
                cy.get('[data-cy="settlement-detail-info"]').should('exist');
            })

            it("서버 오류로 인한 정산 상세 정보 조회 실패 케이스", () => {
                cy.intercept('GET', '/api/admin/settlement/*/info', {
                    statusCode: 500,
                    body: { message: '서버 오류가 발생했습니다.' }
                }).as('getSettlementDetailInfoError');

                cy.wait('@getSettlementDetailInfoError');
                cy.get('[data-cy="settlement-detail-info"]').should('not.exist');
                cy.get('[data-cy="settlement-detail-seller-info"]').should('not.exist');
                cy.get('[data-cy="settlement-detail-product-list"]').should('not.exist');
                cy.get('[data-cy="settlement-history-list"]').should('not.exist');
                cy.checkServerErrorCard("정산 정보 조회에 실패했습니다.");
            })
        })

        describe("정산 상품 정보 조회", () => {
            it("정산 상품 정보 조회 성공 케이스", () => {
                cy.wait('@getSettlementDetailProduct').its('response.statusCode').should("eq", 200);
                cy.get('[data-cy="settlement-detail-product-list"]').should('exist');
                cy.get('[data-cy="settlement-detail-seller-info"]').should('exist');
            })

            it("서버 오류로 인한 정산 상품 정보 조회 실패 케이스", () => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/admin/settlement/*/product-summary'
                }, {
                    statusCode: 500,
                    body: { message: '서버 오류가 발생했습니다.' }
                }).as('getSettlementDetailProductError');
                
                cy.wait('@getSettlementDetailProductError');
                cy.get('[data-cy="settlement-detail-info"]').should('not.exist');
                cy.get('[data-cy="settlement-detail-seller-info"]').should('not.exist');
                cy.get('[data-cy="settlement-detail-product-list"]').should('not.exist');
                cy.get('[data-cy="settlement-history-list"]').should('not.exist');
                cy.checkServerErrorCard("정산 정보 조회에 실패했습니다.");
            })
        })

        describe("정산 이력 조회", () => {
            it("정산 이력 조회 성공 케이스", () => {
                cy.wait('@getSettlementDetailHistory').its('response.statusCode').should("eq", 200);
                cy.get('[data-cy="settlement-history-list"]').should('exist');
            })

            it("서버 오류로 인한 정산 이력 조회 실패 케이스", () => {
                cy.intercept('GET', '/api/admin/settlement/*/history', {
                    statusCode: 500,
                    body: { message: '서버 오류가 발생했습니다.' }
                }).as('getSettlementDetailHistoryError');
                
                cy.wait('@getSettlementDetailHistoryError');
                cy.get('[data-cy="settlement-detail-info"]').should('not.exist');
                cy.get('[data-cy="settlement-detail-product-list"]').should('not.exist');
                cy.get('[data-cy="settlement-detail-seller-info"]').should('not.exist');
                cy.get('[data-cy="settlement-history-list"]').should('not.exist');
                cy.checkServerErrorCard("정산 정보 조회에 실패했습니다.");
            })
        })
    })
})