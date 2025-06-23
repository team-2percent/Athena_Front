describe("사용자 계좌 수정", () => {
    beforeEach(() => {
        cy.fixture('profileEdit/user.json').then((user) => {
            cy.intercept({
                method: 'GET',
                url: '/api/user/57'
            }, {
                body: user,
                statusCode: 200
            }).as('getUserInfo');
        });
    
        cy.fixture('profileEdit/addressList.json').then((address) => {
            cy.intercept({
                method: 'GET',
                url: '/api/delivery/delivery-info'
            }, {
                body: address,
                statusCode: 200
            }).as('getAddressList');
        });

        cy.visitMainPage()
        cy.login()
    })

    describe("프로필 탭 활성화", () => {
        it("계좌 탭 클릭", () => {
            cy.fixture('profileEdit/accountList.json').then((account) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/bankAccount'
                }, {
                    body: account,
                    statusCode: 200
                }).as('getBankAccount');
            });

            cy.visit("/my/edit")
            cy.wait('@getUserInfo').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
            cy.get('[data-cy="menu-tab-계좌"]').should('have.class', 'text-main-color')
        })
    })

    describe("계좌 조회", () => {
        it("계좌 조회 성공", () => {
            cy.fixture('profileEdit/accountList.json').then((account) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/bankAccount'
                }, {
                    body: account,
                    statusCode: 200
                }).as('getBankAccount');
            });
            cy.visit("/my/edit")
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
            cy.get('[data-cy="account-list"]').should('be.visible')
        })

        it("계좌 조회 성공 - 비어있음", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/bankAccount'
            }, {
                body: [],
                statusCode: 200
            }).as('getEmptyBankAccount')
            
            cy.visit("/my/edit")
            cy.wait('@getEmptyBankAccount').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
            cy.checkEmptyMessageCard('등록된 계좌가 없습니다.')
        })

        it("계좌 조회 실패", () => {
            cy.intercept({
                method: 'GET',
                url: '/api/bankAccount'
            }, {
                statusCode: 500,
            }).as('getBankAccountError')
            
            cy.visit("/my/edit")
            cy.wait('@getBankAccountError').its('response.statusCode').should('eq', 500)
            cy.get('[data-cy="menu-tab-계좌"]').click()
            cy.checkServerErrorCard('계좌 조회에 실패했습니다.')
        })

        it("계좌 리스트 내 계좌 표시", () => {
            cy.fixture('profileEdit/accountList.json').then((account) => {
                cy.intercept({
                    method: 'GET',
                    url: '/api/bankAccount'
                }, {
                    body: account,
                    statusCode: 200
                }).as('getBankAccount');
            });
            cy.visit("/my/edit")
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
            
            cy.get('[data-cy="account-list-item"]').each(($el, index) => {
                if (index === 0) {
                    // 기본 계좌
                    cy.wrap($el).find('[data-cy="account-name"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-bank"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-number"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-default-badge"]').should('be.visible')
                } else {
                    // 일반 계좌
                    cy.wrap($el).find('[data-cy="account-name"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-bank"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-number"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="default-change-button"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="account-delete-button"]').should('be.visible')
                }
            })
        })
    })

    describe("기본 계좌 변경", () => {
        beforeEach(() => {
            cy.fixture('profileEdit/accountList.json').then((account) => {
            cy.intercept({
                method: 'GET',
                url: '/api/bankAccount'
            }, {
                body: account,
                statusCode: 200
            }).as('getBankAccount');
            });
            cy.visit("/my/edit")
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
        })

        it("기본 계좌 변경 로딩", () => {
            cy.intercept({
                method: "PUT",
                url: "/api/bankAccount/state?bankAccountId=*"
            }, {
                statusCode: 200,
                delay: 1000
            }).as("changeAccount")

            cy.get('[data-cy="default-change-button"]').first().click()
            cy.get('[data-cy="default-account-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="confirm-button"]').should('have.attr', 'data-loading', 'true')
        })

        it("기본 계좌 변경 성공", () => {
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

            cy.get('[data-cy="default-change-button"]').first().click()
            cy.get('[data-cy="default-account-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            
            cy.wait('@changeAccount').its('response.statusCode').should('eq', 200)
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="default-account-confirm-modal"]').should('not.exist')
        })

        it("기본 계좌 변경 실패", () => {
            cy.intercept({
                method: "PUT",
                url: "/api/bankAccount/state?bankAccountId=*"
            }, {
                statusCode: 500
            }).as("changeAccount")

            cy.get('[data-cy="default-change-button"]').first().click()
            cy.get('[data-cy="default-account-confirm-modal"]').should('be.visible')
            
            cy.get('[data-cy="confirm-button"]').click()
            cy.wait('@changeAccount').its('response.statusCode').should('eq', 500)
            cy.checkErrorTopToast('기본 계좌 변경 실패', '다시 시도해주세요.')
        })
    })

    describe("계좌 삭제", () => {
        beforeEach(() => {
            cy.fixture('profileEdit/accountList.json').then((account) => {
            cy.intercept({
                method: 'GET',
                url: '/api/bankAccount'
            }, {
                body: account,
                statusCode: 200
            }).as('getBankAccount');
            });
            cy.visit("/my/edit")
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
        })

        it("계좌 삭제 로딩", () => {
            cy.intercept({
                method: "DELETE",
                url: "/api/bankAccount?bankAccountId=*"
            }, {
                statusCode: 200,
                delay: 1000
            }).as("deleteAccount")

            cy.get('[data-cy="account-delete-button"]').first().click()
            cy.get('[data-cy="delete-account-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="confirm-button"]').should('have.attr', 'data-loading', 'true')
        })

        it("계좌 삭제 성공", () => {
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

            cy.get('[data-cy="account-delete-button"]').first().click()
            cy.get('[data-cy="delete-account-confirm-modal"]').should('be.visible') 

            cy.get('[data-cy="confirm-button"]').click()
            
            cy.wait('@deleteAccount').its('response.statusCode').should('eq', 200)
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)
        })

        it("계좌 삭제 실패", () => {
            cy.intercept({
                method: "DELETE",
                url: "/api/bankAccount?bankAccountId=*"
            }, {
                statusCode: 500
            }).as("deleteAccount")

            cy.get('[data-cy="account-delete-button"]').first().click()
            cy.get('[data-cy="delete-account-confirm-modal"]').should('be.visible') 

            cy.get('[data-cy="confirm-button"]').click()
            
            cy.wait('@deleteAccount').its('response.statusCode').should('eq', 500)
            cy.checkErrorTopToast('계좌 삭제 실패', '다시 시도해주세요.')
        })
    })

    describe("계좌 추가", () => {
        beforeEach(() => {
            cy.fixture('profileEdit/accountList.json').then((account) => {
            cy.intercept({
                method: 'GET',
                url: '/api/bankAccount'
            }, {
                body: account,
                statusCode: 200
            }).as('getBankAccount');
            });
            cy.visit("/my/edit")
            cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-계좌"]').click()
        })

        describe("입력값 유효성 검사", () => {
            it("유효한 폼 입력 시 계좌 추가 가능", () => {
                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-add-button"]').should('not.be.disabled')
            })

            describe("입력값 공란", () => {
                it("이름 미입력 시 계좌 추가 불가", () => {
                    cy.get('[data-cy="account-bank-input"]').type("테스트 은행")
                    cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                    cy.get('[data-cy="account-add-button"]').should('be.disabled')
                })

                it("은행 미입력 시 계좌 추가 불가", () => {
                    cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                    cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                    cy.get('[data-cy="account-add-button"]').should('be.disabled')
                })

                it("계좌번호 미입력 시 계좌 추가 불가", () => {
                    cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                    cy.get('[data-cy="account-bank-input"]').type("테스트 은행")
                    cy.get('[data-cy="account-add-button"]').should('be.disabled')
                })
            })

            describe("입력값 제한 초과", () => {
                it("이름 제한 초과 입력 시 슬라이싱", () => {
                    const longName = 'a'.repeat(51)
                    cy.get('[data-cy="account-name-input"]').type(longName)
                    cy.get('[data-cy="account-name-input"]').should('have.value', longName.substring(0, 50))
                    cy.get('[data-cy="account-name-error-message"]').should('be.visible')
                })

                it("은행 제한 초과 입력 시 슬라이싱", () => {
                    const longBank = 'a'.repeat(51)
                    cy.get('[data-cy="account-bank-input"]').type(longBank)
                    cy.get('[data-cy="account-bank-input"]').should('have.value', longBank.substring(0, 50))
                    cy.get('[data-cy="account-bank-error-message"]').should('be.visible')
                })

                it("계좌번호 제한 초과 입력 시 슬라이싱", () => {
                    const longNumber = '1'.repeat(51)
                    cy.get('[data-cy="account-number-input"]').type(longNumber)
                    cy.get('[data-cy="account-number-input"]').should('have.value', longNumber.substring(0, 50))
                    cy.get('[data-cy="account-number-error-message"]').should('be.visible')
                })
            })
        })

        describe("계좌 추가", () => {
            it("계좌 추가 로딩", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/bankAccount"
                }, {
                    statusCode: 200,
                    delay: 1000
                }).as("addAccount")

                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-add-button"]').click()
                
                cy.get('[data-cy="account-add-button"]').should('have.attr', 'data-loading', 'true')
            })

            it("계좌 추가 성공", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/bankAccount"
                }, {
                    statusCode: 200
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

                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-add-button"]').click()

                cy.wait('@addAccount').its('response.statusCode').should('eq', 200)
                cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200)

                cy.get('[data-cy="account-name-input"]').should('have.value', '')
                cy.get('[data-cy="account-bank-input"]').should('have.value', '')
                cy.get('[data-cy="account-number-input"]').should('have.value', '')
            })

            it("계좌 추가 실패", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/bankAccount"
                }, {
                    statusCode: 500
                }).as("addAccount")

                cy.get('[data-cy="account-name-input"]').type("테스트 계좌")
                cy.get('[data-cy="account-bank-input"]').type("테스트 은행")
                cy.get('[data-cy="account-number-input"]').type("12345678901234567890")
                cy.get('[data-cy="account-add-button"]').click()

                cy.wait('@addAccount').its('response.statusCode').should('eq', 500)
                cy.checkErrorTopToast('계좌 추가 실패', '다시 시도해주세요.')
            })
        })
    })
})