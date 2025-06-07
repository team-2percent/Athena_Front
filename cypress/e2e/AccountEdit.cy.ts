describe("배송지 편집 페이지", () => {
    beforeEach(() => {
        cy.fixture('profileEdit/user.json').then((user) => {
            cy.intercept('GET', '/api/user/57', user).as('getUserInfo');
        });
    
        cy.fixture('profileEdit/accountList.json').then((account) => {
            cy.intercept('GET', '/api/bankAccount', account).as('getBankAccount');
        });
    
        cy.fixture('profileEdit/addressList.json').then((address) => {
            cy.intercept('GET', '/api/delivery/delivery-info', address).as('getAddressList');
        });

        // given - 로그인, 프로필 편집 페이지 접근, 계좌 탭 접근, 추가 박스와 리스트 박스 확인
        cy.visitMainPage()
        cy.login()
        cy.visit("/my/edit")

        cy.wait('@getUserInfo').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy="menu-tab-계좌"]').should('be.visible')
        cy.get('[data-cy="menu-tab-배송지"]').should('be.visible')
        cy.get('[data-cy="menu-tab-탈퇴하기"]').should('be.visible')

        cy.get('[data-cy="menu-tab-계좌"]').click()
        cy.get('[data-cy="menu-tab-계좌"]').should('have.class', 'text-main-color')

        cy.get('[data-cy="account-add-form"]').should('be.visible')
        cy.get('[data-cy="account-list"]').should('be.visible')
    })

    describe("유저 계좌 추가", () => {
        beforeEach(() => {
            cy.get('[data-cy="account-add-button"]').should('be.visible').should('be.disabled')
        })

        describe("유저 계좌 추가 성공 케이스", () => {
            it("유효한 폼 작성 후 계좌 추가 버튼 클릭하면 계좌 추가 성공", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/bankAccount"
                }).as("addAccount")

                cy.fixture('profileEdit/accountList.json').then((accountFixture) => {
                    cy.intercept("GET", "/api/bankAccount", (req) => {
                        const updatedResponse = [...accountFixture, {
                            id: 4,
                            bankName: "테스트 은행",
                            bankAccount: "12345678901234567890",
                            isDefault: false,
                            accountHolder: "테스트 계좌"
                        }]
                        req.reply(updatedResponse);
                    }).as("getBankAccount")
                })

                // when - 계좌 추가 폼 작성, 추가 버튼 클릭
                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")

                cy.get('[data-cy="account-add-button"]').should('be.enabled').click()

                cy.wait('@addAccount').its('response.statusCode').should('eq', 200)
                cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)

                // then - 계좌 리스트 박스 확인
                cy.get('[data-cy="account-list"]').should('be.visible')
                cy.get('[data-cy="account-list-item"]').should('have.length', 4)
                cy.get('[data-cy="account-list-item"]').last().should('contain', '테스트 계좌')
                cy.get('[data-cy="account-list-item"]').last().should('contain', '12345678901234567890')
                cy.get('[data-cy="account-list-item"]').last().should('contain', '테스트 은행')
            })
        })

        describe("유저 계좌 추가 불가 케이스", () => {
            it("계좌 이름 공란", () => {
                // when - 폼 중 계좌 이름만 지움
                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")

                cy.get('[data-cy="account-add-button"]').should('be.enabled')

                cy.get('[data-cy="account-name-input"]').clear()

                // then - 에러메세지 확인, 버튼 비활성화
                cy.get('[data-cy="account-name-error-message"]').should('be.visible')
                cy.get('[data-cy="account-add-button"]').should('be.disabled')
            })

            it("계좌 번호 공란", () => {
                // when - 폼 중 계좌 번호만 지움
                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")

                cy.get('[data-cy="account-add-button"]').should('be.enabled')

                cy.get('[data-cy="account-number-input"]').clear()

                // then - 에러메세지 확인, 버튼 비활성화
                cy.get('[data-cy="account-number-error-message"]').should('be.visible')
                cy.get('[data-cy="account-add-button"]').should('be.disabled')
            })

            it("계좌 은행 공란", () => {
                // when - 폼 중 계좌 은행만 지움
                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")

                cy.get('[data-cy="account-add-button"]').should('be.enabled')

                cy.get('[data-cy="account-bank-input"]').clear()

                // then - 에러메세지 확인, 버튼 비활성화
                cy.get('[data-cy="account-bank-error-message"]').should('be.visible')
                cy.get('[data-cy="account-add-button"]').should('be.disabled')
            })
        })

        describe("유저 계좌 추가 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept("POST", "/api/bankAccount", (req) => {
                    req.reply(500)
                }).as("addAccount")

                // when - 계좌 추가 폼 작성, 추가 버튼 클릭
                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")

                cy.get('[data-cy="account-add-button"]').should('be.enabled').click()
                
                cy.wait('@addAccount').its('response.statusCode').should('eq', 500)

                // then - 에러메세지 확인, 버튼 활성화
                cy.checkErrorTopToast('계좌 추가 실패', '다시 시도해주세요.')
                cy.get('[data-cy="account-add-button"]').should('be.enabled')
            })
        })
    })

    describe("유저 기본 계좌 변경", () => {
        it("기본 계좌에는 변경 버튼 없음", () => {
            // given - 계좌 리스트 박스 확인
            cy.get('[data-cy="account-list-item"]').each(($el, index) => {
                if (index === 0) {
                    cy.wrap($el).find('[data-cy="account-default-mark"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-default-change-button"]').should('not.exist')
                } else {
                    cy.wrap($el).find('[data-cy="account-default-mark"]').should('not.exist')
                    cy.wrap($el).find('[data-cy="account-default-change-button"]').should('be.visible')
                }
            })
        })
        
        describe("유저 기본 계좌 변경 성공 케이스", () => {
            it("기본 계좌가 아닌 계좌의 변경 버튼을 클릭하면, 모달 창 노출, 확인 버튼 클릭하면 계좌 변경 성공", () => {
                cy.intercept({
                    method: "PUT",
                    url: "/api/bankAccount/state?bankAccountId=*"
                }, {
                    statusCode: 200
                }).as("changeAccount")

                cy.fixture('profileEdit/accountList.json').then((accountFixture) => {
                    cy.intercept("GET", "/api/bankAccount", (req) => {
                        const updatedResponse = accountFixture.map((item: any) => {
                            if (item.id === 1) {
                                return { ...item, isDefault: false }
                            } else if (item.id === 2) {
                                return { ...item, isDefault: true }
                            }
                            return item
                        })
                        req.reply(updatedResponse)
                    }).as("getBankAccount")
                })

                // when - 기본 계좌가 아닌 계좌의 변경 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="account-default-change-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="default-account-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="default-account-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@changeAccount').its('response.statusCode').should('eq', 200)
                cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)

                // then - 계좌 리스트 박스 확인
                cy.get('[data-cy="account-list"]').should('be.visible')

                cy.get('[data-cy="account-list-item"]').eq(0).within($el => {
                    cy.wrap($el).find('[data-cy="account-default-mark"]').should('not.be.exist')
                    cy.wrap($el).find('[data-cy="account-default-change-button"]').should('be.exist')
                })

                cy.get('[data-cy="account-list-item"]').eq(1).within($el => {
                    cy.wrap($el).find('[data-cy="account-default-mark"]').should('be.exist')
                    cy.wrap($el).find('[data-cy="account-default-change-button"]').should('not.be.exist')
                })
            })
        })

        describe("유저 기본 계좌 변경 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept({
                    method: "PUT",
                    url: "/api/bankAccount/state?bankAccountId=*"
                }, {
                    statusCode: 500
                }).as("changeAccount")

                // when - 기본 계좌가 아닌 계좌의 변경 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="account-default-change-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="default-account-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="default-account-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@changeAccount').its('response.statusCode').should('eq', 500)

                // then - 서버 에러 확인, 버튼 활성화
                cy.checkErrorTopToast('기본 계좌 변경 실패', '다시 시도해주세요.')
                cy.get('[data-cy="default-account-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="default-account-confirm-modal"]').get('[data-cy="cancel-button"]').should('be.visible').click()

                cy.get('[data-cy="account-default-change-button"]').eq(1).should('be.visible')
                cy.get('[data-cy="account-list-item"]').should('have.length', 3)
            })
        })
    })

    describe("유저 계좌 삭제", () => {
        it("기본 계좌에는 삭제 버튼 없음", () => {
            cy.get('[data-cy="account-list-item"]').each(($el, index) => {
                if (index === 0) {
                    cy.wrap($el).find('[data-cy="account-default-mark"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-delete-button"]').should('not.exist')
                } else {
                    cy.wrap($el).find('[data-cy="account-default-mark"]').should('not.exist')
                    cy.wrap($el).find('[data-cy="account-delete-button"]').should('be.visible')
                }
            })
        })
        
        describe("유저 계좌 삭제 성공 케이스", () => {
            it("기본 계좌가 아닌 계좌의 삭제 버튼을 클릭하면, 모달 창 노출, 확인 버튼 클릭하면 계좌 삭제 성공", () => {
                cy.intercept({
                    method: "DELETE",
                    url: "/api/bankAccount?bankAccountId=*"
                }, {
                    statusCode: 200
                }).as("deleteAccount")

                cy.fixture('profileEdit/accountList.json').then((accountFixture) => {
                    cy.intercept("GET", "/api/bankAccount", (req) => {
                        const updatedResponse = accountFixture.filter((item: any) => item.id !== 2)
                        req.reply(updatedResponse)
                    }).as("getBankAccount")
                })

                // when - 기본 계좌가 아닌 계좌의 삭제 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="account-delete-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="delete-account-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="delete-account-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@deleteAccount').its('response.statusCode').should('eq', 200)
                cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200) 

                // then - 계좌 리스트 박스 확인
                cy.get('[data-cy="account-list"]').should('be.visible')
                cy.get('[data-cy="account-list-item"]').should('have.length', 2)
            })
        })

        describe("유저 기본 계좌 변경 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept({
                    method: "DELETE",
                    url: "/api/bankAccount?bankAccountId=*"
                }, {
                    statusCode: 500
                }).as("deleteAccount")

                cy.get('[data-cy="account-delete-button"]').eq(1).should('be.visible').click()
                
                cy.get('[data-cy="delete-account-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="delete-account-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@deleteAccount').its('response.statusCode').should('eq', 500)

                cy.checkErrorTopToast('계좌 삭제 실패', '다시 시도해주세요.')
                cy.get('[data-cy="delete-account-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="delete-account-confirm-modal"]').get('[data-cy="cancel-button"]').should('be.visible').click()

                cy.get('[data-cy="account-delete-button"]').eq(1).should('be.visible')
                cy.get('[data-cy="account-list-item"]').should('have.length', 3)
            })
        })
    })

})