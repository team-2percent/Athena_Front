describe("관리자 정산 관리", () => {
    beforeEach(() => {
        cy.visitMainPage();
        cy.adminLogin();
    })

    describe("목록 조회", () => {
        it("목록 조회 성공 시 정산 목록 정상 표시", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementList')

            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should('eq', 200);

            // 정산 리스트 표시 확인
            cy.get('[data-cy="settlement-list"]').should('be.visible');
            cy.get('[data-cy="settlement-list-item"]').should('have.length', 10);

            // 정산 정보 표시 확인
            cy.get('[data-cy="settlement-list-item"]').first().within(() => {
                cy.get('[data-cy="settlement-project-name"]').should('be.visible');
                cy.get('[data-cy="settlement-total-amount"]').should('be.visible');
                cy.get('[data-cy="settlement-fee"]').should('be.visible');
                cy.get('[data-cy="settlement-payout-amount"]').should('be.visible');
                cy.get('[data-cy="settlement-seller-name"]').should('be.visible');
                cy.get('[data-cy="settlement-settled-at"]').should('be.visible');
                cy.get('[data-cy="settlement-status"]').should('be.visible');
            });
        });

        it("목록 조회 성공, 데이터 없을 시 비어있음 메시지 표시", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/settlement'
            }, {
                statusCode: 200,
                body: { content: [], pageInfo: { currentPage: 0, totalPages: 0 } }
            }).as('getEmptySettlementList');
            
            cy.visit('/admin/settlement');
            cy.wait('@getEmptySettlementList').its('response.statusCode').should('eq', 200);
            cy.checkEmptyMessageCard("정산 내역이 없습니다.");
        });

        it("서버 에러로 인한 목록 조회 실패 시 서버에러 메시지 표시", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/admin/settlement'
            }, {
                statusCode: 500,
            }).as('getSettlementListError');
            
            cy.visit('/admin/settlement');
            cy.wait('@getSettlementListError').its('response.statusCode').should('eq', 500);
            cy.checkServerErrorCard("정산 내역 조회에 실패했습니다.");
            cy.get('[data-cy="retry-button"]').should('be.visible');
        });
    });

    describe("상태 필터", () => {
        beforeEach(() => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementList')

            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should('eq', 200);
        });

        it("상태 select 표시", () => {
            cy.get('[data-cy="status-filter"]').should('be.visible')
                .and('contain', '상태 전체');

            cy.get('[data-cy="status-filter"]').select('상태 전체');

            // 상태 옵션 확인
            cy.get('[data-cy="status-filter"] option').eq(0).should('have.value', 'ALL');
            cy.get('[data-cy="status-filter"] option').eq(1).should('have.value', 'PENDING');
            cy.get('[data-cy="status-filter"] option').eq(2).should('have.value', 'COMPLETED');
            cy.get('[data-cy="status-filter"] option').eq(3).should('have.value', 'FAILED');
        });

        it("상태 현재 상태 클릭 시 요청 없음", () => {
            cy.get('[data-cy="status-filter"]').select('상태 전체');
            cy.get('[data-cy="status-filter"]').should('have.value', 'ALL');
        });

        it("상태 다른 상태 클릭 시 리로드", () => {
            cy.fixture('admin/settlement/settlementListCompleted.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement?status=COMPLETED', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementListCompleted')

            cy.get('[data-cy="status-filter"]').select('정산 완료');
            cy.wait('@getSettlementListCompleted');
            cy.get('[data-cy="status-filter"]').should('have.value', 'COMPLETED');
        });
    });

    describe("연/월 필터", () => {
        beforeEach(() => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementList')

            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should('eq', 200);
        });

        it("연도 select 표시", () => {
            cy.get('[data-cy="year-filter"]').should('be.visible')
                .and('contain', '년도 전체');

            cy.get('[data-cy="year-filter"]').select('년도 전체');

            // 연도 옵션 확인
            cy.get('[data-cy="year-filter"] option').eq(0).should('have.value', '0');
            cy.get('[data-cy="year-filter"] option').eq(1).should('have.value', '2025');
        });

        it("현재 상태 클릭 시 요청 없음", () => {
            cy.get('[data-cy="year-filter"]').select('년도 전체');
            cy.get('[data-cy="year-filter"]').should('have.value', '0');
        });

        it("다른 상태 클릭 시 리로드", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement?year=2025', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementListYear')

            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear');
            cy.get('[data-cy="year-filter"]').should('have.value', '2025');
            cy.get('[data-cy="month-filter"]').should('be.visible');
        });

        it("월 select 표시", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement?year=2025', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementListYear')

            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear').its('response.statusCode').should('eq', 200);

            cy.get('[data-cy="month-filter"]').should('be.visible')
                .and('contain', '월 전체');

            cy.get('[data-cy="month-filter"]').select('월 전체');

            // 월 옵션 확인
            cy.get('[data-cy="month-filter"] option').should('have.length', 13);
            cy.get('[data-cy="month-filter"] option').eq(0).should('have.value', '0');
            for (let i = 1; i <= 12; i++) {
                cy.get('[data-cy="month-filter"] option').eq(i).should('have.value', i.toString());
            }
        });

        it("현재 상태 클릭 시 요청 없음", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement?year=2025', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementListYear')
            
            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear').its('response.statusCode').should('eq', 200);

            cy.get('[data-cy="month-filter"]').select('월 전체');
            cy.get('[data-cy="month-filter"]').should('have.value', '0');
        });

        it("다른 상태 클릭 시 리로드", () => {
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

            cy.get('[data-cy="year-filter"]').select('2025');
            cy.wait('@getSettlementListYear').its('response.statusCode').should('eq', 200);

            cy.get('[data-cy="month-filter"]').select('6');
            cy.wait('@getSettlementListYearMonth');
            cy.get('[data-cy="month-filter"]').should('have.value', '6');
        });
    });

    describe("페이지네이션", () => {
        beforeEach(() => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementList')

            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should('eq', 200);
        });

        it("첫 페이지에서는 다른 페이지와 마지막 페이지 이동, 다음 페이지 이동 버튼만 활성화", () => {
            cy.scrollTo('bottom');

            cy.get('[data-cy="first-page-button"]').should('be.disabled');
            cy.get('[data-cy="prev-page-button"]').should('be.disabled');
            cy.get('[data-cy="page-button"]').eq(0).should('be.disabled');
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled');
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled');
        });

        it("중간 페이지에서는 현재 페이지 제외 모두 활성화", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                const newSettlementList = settlementList;
                newSettlementList.pageInfo.currentPage = 1;
                cy.intercept('GET', '/api/admin/settlement?page=1', {
                    statusCode: 200,
                    body: newSettlementList
                }).as('getSettlementListPage2');
            });

            cy.scrollTo('bottom');
            cy.get('[data-cy="page-button"]').eq(1).click();

            cy.wait('@getSettlementListPage2').its('response.statusCode').should('eq', 200);
            cy.get('[data-cy="first-page-button"]').should('not.be.disabled');
            cy.get('[data-cy="prev-page-button"]').should('not.be.disabled');
            cy.get('[data-cy="page-button"]').eq(1).should('be.disabled');
            cy.get('[data-cy="next-page-button"]').should('not.be.disabled');
            cy.get('[data-cy="last-page-button"]').should('not.be.disabled');
        });

        it("마지막 페이지에서는 다른 페이지와 첫 페이지 이동, 이전 페이지 이동 버튼만 활성화", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                const newSettlementList = settlementList;
                newSettlementList.pageInfo.currentPage = newSettlementList.pageInfo.totalPages - 1;
                cy.intercept('GET', `/api/admin/settlement?page=${newSettlementList.pageInfo.totalPages - 1}`, {
                    statusCode: 200,
                    body: newSettlementList
                }).as('getSettlementListLastPage');
            });

            cy.scrollTo('bottom');
            cy.get('[data-cy="last-page-button"]').click();

            cy.wait('@getSettlementListLastPage').its('response.statusCode').should('eq', 200);
            cy.get('[data-cy="first-page-button"]').should('not.be.disabled');
            cy.get('[data-cy="prev-page-button"]').should('not.be.disabled');
            cy.get('[data-cy="page-button"]').last().should('be.disabled');
            cy.get('[data-cy="next-page-button"]').should('be.disabled');
            cy.get('[data-cy="last-page-button"]').should('be.disabled');
        });
    });

    describe("상세 페이지 이동", () => {
        it("상세 페이지 진입", () => {
            cy.fixture('admin/settlement/settlementList.json').then((settlementList) => {
                cy.intercept('GET', '/api/admin/settlement', {
                    statusCode: 200,
                    body: settlementList
                })
            }).as('getSettlementList')

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

            cy.visit('/admin/settlement');
            cy.wait('@getSettlementList').its('response.statusCode').should('eq', 200);

            cy.get('[data-cy="settlement-list-item"]').first().click();

            cy.wait('@getSettlementDetailInfo').its('response.statusCode').should('eq', 200);
            cy.wait('@getSettlementDetailProduct').its('response.statusCode').should('eq', 200);
            cy.wait('@getSettlementDetailHistory').its('response.statusCode').should('eq', 200);
            cy.url().should('include', '/admin/settlement/');
        });
    });
})