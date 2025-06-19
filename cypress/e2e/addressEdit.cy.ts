describe("사용자 배송지 수정", () => {
    beforeEach(() => {
        cy.fixture('profileEdit/user.json').then((user) => {
            cy.intercept('GET', '/api/user/*', user).as('getUserInfo');
        });
    
        cy.fixture('profileEdit/accountList.json').then((account) => {
            cy.intercept('GET', '/api/bankAccount', account).as('getBankAccount');
        });
    
        cy.fixture('profileEdit/addressList.json').then((address) => {
            cy.intercept('GET', '/api/delivery/delivery-info', address).as('getAddressList');
        });

        cy.visitMainPage()
        cy.login()
    })

    describe("프로필 탭 활성화", () => {
        it("배송지 탭 클릭", () => {
            cy.visit("/my/edit")
            cy.wait('@getUserInfo').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
            cy.get('[data-cy="menu-tab-배송지"]').should('have.class', 'text-main-color')
        })
    })

    describe("배송지 조회", () => {
        it("배송지 조회 성공", () => {
            cy.visit("/my/edit")
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
            cy.get('[data-cy="address-list"]').should('be.visible')
        })

        it("배송지 조회 성공 - 비어있음", () => {
            cy.intercept('GET', '/api/delivery/delivery-info', []).as('getEmptyAddressList')
            
            cy.visit("/my/edit")
            cy.wait('@getEmptyAddressList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
            cy.checkEmptyMessageCard('등록된 배송지가 없습니다.')
        })

        it("배송지 조회 실패", () => {
            cy.intercept('GET', '/api/delivery/delivery-info', {
                statusCode: 500
            }).as('getAddressListError')
            
            cy.visit("/my/edit")
            cy.wait('@getAddressListError').its('response.statusCode').should('eq', 500)
            cy.get('[data-cy="menu-tab-배송지"]').click()
            cy.checkServerErrorCard('배송지 조회에 실패했습니다.')
        })

        it("배송지 리스트 내 배송지 표시", () => {
            cy.visit("/my/edit")
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
            
            cy.get('[data-cy="address-list-item"]').each(($el, index) => {
                if (index === 0) {
                    // 기본 배송지
                    cy.wrap($el).find('[data-cy="address"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="detail-address"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="default-address-badge"]').should('be.visible')
                } else {
                    // 일반 배송지
                    cy.wrap($el).find('[data-cy="address"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="detail-address"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="default-address-change-button"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="address-delete-button"]').should('be.visible')
                }
            })
        })
    })

    describe("기본 배송지 변경", () => {
        beforeEach(() => {
            cy.visit("/my/edit")
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
        })

        it("기본 배송지 변경 로딩", () => {
            cy.intercept({
                method: "PUT",
                url: "/api/delivery/state"
            }, {
                statusCode: 200,
                delay: 1000
            }).as("changeAddress")

            cy.get('[data-cy="default-address-change-button"]').first().click()
            cy.get('[data-cy="default-address-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="confirm-button-loading"]').should('be.visible')
        })

        it("기본 배송지 변경 성공", () => {
            cy.intercept({
                method: "PUT",
                url: "/api/delivery/state"
            }, {
                statusCode: 200
            }).as("changeAddress")

            cy.fixture('profileEdit/addressList.json').then((addressFixture) => {
                cy.intercept("GET", "/api/delivery/delivery-info", (req) => {
                    const updatedResponse = addressFixture.map((item: any) => {
                        if (item.id === 1) {
                            return { ...item, isDefault: false }
                        } else if (item.id === 2) {
                            return { ...item, isDefault: true }
                        }
                        return item
                    })
                    req.reply(updatedResponse)
                }).as("getAddressList")
            })

            cy.get('[data-cy="default-address-change-button"]').first().click()
            cy.get('[data-cy="default-address-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            
            cy.wait('@changeAddress').its('response.statusCode').should('eq', 200)
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="default-address-confirm-modal"]').should('not.exist')
        })

        it("기본 배송지 변경 실패", () => {
            cy.intercept({
                method: "PUT",
                url: "/api/delivery/state"
            }, {
                statusCode: 500
            }).as("changeAddress")

            cy.get('[data-cy="default-address-change-button"]').first().click()
            cy.get('[data-cy="default-address-confirm-modal"]').should('be.visible')
            
            cy.get('[data-cy="confirm-button"]').click()
            cy.wait('@changeAddress').its('response.statusCode').should('eq', 500)
            cy.checkErrorTopToast('기본 배송지 변경 실패', '다시 시도해주세요.')
        })
    })

    describe("배송지 삭제", () => {
        beforeEach(() => {
            cy.visit("/my/edit")
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
        })

        it("배송지 삭제 로딩", () => {
            cy.intercept({
                method: "DELETE",
                url: "/api/delivery/delivery-info/*"
            }, {
                statusCode: 200,
                delay: 1000
            }).as("deleteAddress")

            cy.get('[data-cy="address-delete-button"]').first().click()
            cy.get('[data-cy="delete-address-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="confirm-button-loading"]').should('be.visible')
        })

        it("배송지 삭제 성공", () => {
            cy.intercept({
                method: "DELETE",
                url: "/api/delivery/delivery-info/*"
            }, {
                statusCode: 200
            }).as("deleteAddress")

            cy.fixture('profileEdit/addressList.json').then((addressFixture) => {
                cy.intercept("GET", "/api/delivery/delivery-info", (req) => {
                    const updatedResponse = addressFixture.filter((item: any) => item.id !== 2)
                    req.reply(updatedResponse)
                }).as("getAddressList")
            })

            cy.get('[data-cy="address-delete-button"]').first().click()
            cy.get('[data-cy="delete-address-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            
            cy.wait('@deleteAddress').its('response.statusCode').should('eq', 200)
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)
        })

        it("배송지 삭제 실패", () => {
            cy.intercept({
                method: "DELETE",
                url: "/api/delivery/delivery-info/*"
            }, {
                statusCode: 500
            }).as("deleteAddress")

            cy.get('[data-cy="address-delete-button"]').first().click()
            cy.get('[data-cy="delete-address-confirm-modal"]').should('be.visible')

            cy.get('[data-cy="confirm-button"]').click()
            
            cy.wait('@deleteAddress').its('response.statusCode').should('eq', 500)
            cy.checkErrorTopToast('배송지 삭제 실패', '다시 시도해주세요.')
        })
    })

    describe("배송지 추가", () => {
        beforeEach(() => {
            cy.visit("/my/edit")
            cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)
            cy.get('[data-cy="menu-tab-배송지"]').click()
        })

        describe("입력값 유효성 검사", () => {
            it("유효한 폼 입력 시 배송지 추가 가능", () => {
                cy.get('[data-cy="address-search-button"]').click()
                cy.get('[data-cy="address-search-modal"]').should('be.visible')
                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")
                cy.get('[data-cy="address-add-button"]').should('not.be.disabled')
            })

            describe("입력값 공란", () => {
                it("주소 미추가 시 배송지 추가 불가", () => {
                    cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")
                    cy.get('[data-cy="address-add-button"]').should('be.disabled')
                    cy.get('[data-cy="address-error-message"]').should('be.visible')
                })

                it("상세주소 미입력 시 배송지 추가 불가", () => {
                    cy.get('[data-cy="address-search-button"]').click()
                    cy.get('[data-cy="address-search-modal"]').should('be.visible')
                    cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
                    cy.get('[data-cy="address-add-button"]').should('be.disabled')
                })
            })

            describe("입력값 제한 초과", () => {
                it("상세주소 제한 초과 입력 시 슬라이싱", () => {
                    cy.get('[data-cy="address-search-button"]').click()
                    cy.get('[data-cy="address-search-modal"]').should('be.visible')
                    cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
                    
                    const longDetailAddress = 'a'.repeat(101)
                    cy.get('[data-cy="address-detail-input"]').type(longDetailAddress)
                    cy.get('[data-cy="address-detail-input"]').should('have.value', longDetailAddress.substring(0, 100))
                    cy.get('[data-cy="detail-address-error-message"]').should('be.visible')
                })
            })
        })

        describe("배송지 추가", () => {
            it("배송지 추가 로딩", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/delivery/delivery-info"
                }, {
                    statusCode: 200,
                    delay: 1000
                }).as("addAddress")

                cy.get('[data-cy="address-search-button"]').click()
                cy.get('[data-cy="address-search-modal"]').should('be.visible')
                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")
                cy.get('[data-cy="address-add-button"]').click()
                
                cy.get('[data-cy="address-add-button-loading"]').should('be.visible')
            })

            it("배송지 추가 성공", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/delivery/delivery-info"
                }, {
                    statusCode: 200
                }).as("addAddress")

                cy.fixture('profileEdit/addressList.json').then((addressFixture) => {
                    cy.intercept("GET", "/api/delivery/delivery-info", (req) => {
                        const updatedResponse = [...addressFixture, {
                            id: 4,
                            zipcode: "12345",
                            address: "판교역로 166",
                            detailAddress: "테스트 상세주소"
                        }]
                        req.reply(updatedResponse)
                    }).as("getAddressList")
                })

                cy.get('[data-cy="address-search-button"]').click()
                cy.get('[data-cy="address-search-modal"]').should('be.visible')
                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")
                cy.get('[data-cy="address-add-button"]').click()

                cy.wait('@addAddress').its('response.statusCode').should('eq', 200)
                cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)

                cy.get('[data-cy="address-info"]').should('have.text', '')
                cy.get('[data-cy="address-detail-input"]').should('have.value', '')
            })

            it("배송지 추가 실패", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/delivery/delivery-info"
                }, {
                    statusCode: 500
                }).as("addAddress")

                cy.get('[data-cy="address-search-button"]').click()
                cy.get('[data-cy="address-search-modal"]').should('be.visible')
                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")
                cy.get('[data-cy="address-add-button"]').click()

                cy.wait('@addAddress').its('response.statusCode').should('eq', 500)
                cy.checkErrorTopToast('배송지 추가 실패', '다시 시도해주세요.')
            })
        })
    })
})