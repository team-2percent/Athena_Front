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

        // given - 로그인, 프로필 편집 페이지 접근, 배송지 탭 접근, 추가 박스와 리스트 박스 확인
        cy.visitMainPage()
        cy.login()
        cy.visit("/my/edit")

        cy.wait('@getUserInfo').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy="menu-tab-계좌"]').should('be.visible')
        cy.get('[data-cy="menu-tab-배송지"]').should('be.visible')
        cy.get('[data-cy="menu-tab-탈퇴하기"]').should('be.visible')

        cy.get('[data-cy="menu-tab-배송지"]').click()
        cy.get('[data-cy="menu-tab-배송지"]').should('have.class', 'text-main-color')

        cy.get('[data-cy="address-add-form"]').should('be.visible')
        cy.get('[data-cy="address-list"]').should('be.visible')
    })

    describe("유저 배송지 추가", () => {
        beforeEach(() => {
            cy.get('[data-cy="address-add-button"]').should('be.disabled')
        })
        
        describe("유저 배송지 추가 성공 케이스", () => {
            it("유효한 폼 작성 후 배송지 추가 버튼 클릭하면 배송지 추가 성공", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/delivery/delivery-info"
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

                // when - 배송지 추가 폼 작성, 추가 버튼 클릭
                cy.get('[data-cy="address-search-button"]').click();
                cy.get('[data-cy="address-search-modal"]').should('be.visible').as('addressSearchModal')
                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()

                cy.get('[data-cy="address-info"]').should('have.text', '[12345] 서울특별시 강남구 테헤란로 123')
                
                // 상세주소 입력
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")

                // 배송지 추가 버튼 활성화 확인 후 클릭
                cy.get('[data-cy="address-add-button"]').should('not.be.disabled').click()
                

                // then - 배송지 추가 성공
                cy.wait('@addAddress').its('response.statusCode').should('eq', 200)
                cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)

                // 추가된 배송지 확인
                cy.get('[data-cy="address-list-item"]').should('have.length', 4)
                cy.get('[data-cy="address-list-item"]').eq(3).within(() => {
                    cy.contains('판교역로 166').should('be.visible')
                    cy.contains('테스트 상세주소').should('be.visible')
                })
            })
        })

        describe("유저 배송지 추가 불가 케이스", () => {
            it("주소 공란", () => {
                // when - 배송지 상세 주소만 작성
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")

                // then - 에러메세지 확인, 버튼 비활성화
                cy.get('[data-cy="address-error-message"]').should('be.visible')
                cy.get('[data-cy="address-add-button"]').should('be.disabled')
            })

            it("상세 주소 공란", () => {
                // when - 배송지 주소만 선택
                cy.get('[data-cy="address-search-button"]').click();
                cy.get('[data-cy="address-search-modal"]').should('be.visible')

                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()

                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")

                cy.get('[data-cy="address-add-button"]').should('not.be.disabled')

                cy.get('[data-cy="address-detail-input"]').type("{selectall}{backspace}")

                // then - 버튼 비활성화
                cy.get('[data-cy="detail-address-error-message"]').should('be.visible')
                cy.get('[data-cy="address-add-button"]').should('be.disabled')
            })
        })

        describe("유저 배송지 추가 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/delivery/delivery-info"
                }, {
                    statusCode: 500
                }).as("addAddress")
              
                // when - 배송지 추가 폼 작성, 추가 버튼 클릭
                cy.get('[data-cy="address-search-button"]').click();
                cy.get('[data-cy="address-search-modal"]').should('be.visible')

                cy.get('[data-cy="mock-postcode"]').should('be.visible').click()

                // 상세주소 입력
                cy.get('[data-cy="address-detail-input"]').type("테스트 상세주소")

                // 배송지 추가 버튼 활성화 확인 후 클릭
                cy.get('[data-cy="address-add-button"]').should('not.be.disabled').click()

                cy.wait('@addAddress').its('response.statusCode').should('eq', 500)

                // then - 서버 에러 확인, 버튼 활성화
                cy.checkErrorTopToast('배송지 추가 실패', '다시 시도해주세요.')
                cy.get('[data-cy="address-add-button"]').should('not.be.disabled')
            })
        })
    })

    describe("유저 기본 배송지 변경", () => {
        it("기본 배송지에는 변경 버튼 없음", () => {
            cy.get('[data-cy="address-list-item"]').each(($el, index) => {
                if (index === 0) {
                    cy.wrap($el).find('[data-cy="default-address-mark"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="default-address-change-button"]').should('not.exist')
                } else {
                    cy.wrap($el).find('[data-cy="default-address-mark"]').should('not.exist')
                    cy.wrap($el).find('[data-cy="default-address-change-button"]').should('be.visible')
                }
            })
        })
        
        describe("유저 기본 배송지 변경 성공 케이스", () => {
            it("기본 배송지가 아닌 배송지의 변경 버튼을 클릭하면, 모달 창 노출, 확인 버튼 클릭하면 배송지 변경 성공", () => {
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

                // when - 기본 배송지가 아닌 배송지의 변경 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="default-address-change-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="default-address-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="default-address-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@changeAddress').its('response.statusCode').should('eq', 200)
                cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)

                // then - 배송지 리스트 확인, 기본 배송지는 2번째로 변경됨
                cy.get('[data-cy="address-list-item"]').should('have.length', 3)
                cy.get('[data-cy="address-list-item"]').eq(0).within($el => {
                    cy.wrap($el).find('[data-cy="default-address-mark"]').should('not.exist')
                    cy.wrap($el).find('[data-cy="default-address-change-button"]').should('be.visible')
                })

                cy.get('[data-cy="address-list-item"]').eq(1).within($el => {
                    cy.wrap($el).find('[data-cy="default-address-mark"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="default-address-change-button"]').should('not.exist')
                })
            })
        })

        describe("유저 기본 배송지 변경 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept({
                    method: "PUT",
                    url: "/api/delivery/state"
                }, {
                    statusCode: 500
                }).as("changeAddress")

                // when - 기본 배송지가 아닌 배송지의 변경 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="default-address-change-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="default-address-confirm-modal"]').should('be.visible').as('defaultAddressConfirmModal')
                cy.get('[data-cy="default-address-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@changeAddress').its('response.statusCode').should('eq', 500)

                // then - 서버 에러 확인, 버튼 활성화
                cy.checkErrorTopToast('기본 배송지 변경 실패', '다시 시도해주세요.')
                cy.get('@defaultAddressConfirmModal').should('be.visible')
                cy.get('@defaultAddressConfirmModal').get('[data-cy="cancel-button"]').should('be.visible').click()

                cy.get('[data-cy="default-address-mark"]').first().should('be.visible')
                cy.get('[data-cy="default-address-change-button"]').eq(1).should('be.visible')
                cy.get('[data-cy="address-list-item"]').should('have.length', 3)
            })
        })
    })

    describe("유저 배송지 삭제", () => {
        it("기본 배송지에는 삭제 버튼 없음", () => {
            cy.get('[data-cy="address-list-item"]').each(($el, index) => {
                if (index === 0) {
                    cy.wrap($el).find('[data-cy="default-address-mark"]').should('be.visible')
                    cy.wrap($el).find('[data-cy="address-delete-button"]').should('not.exist')
                } else {
                    cy.wrap($el).find('[data-cy="default-address-mark"]').should('not.exist')
                    cy.wrap($el).find('[data-cy="address-delete-button"]').should('be.visible')
                }
            })
        })
        
        describe("유저 배송지 삭제 성공 케이스", () => {
            it("배송지의 삭제 버튼을 클릭하면, 모달 창 노출, 확인 버튼 클릭하면 배송지 삭제 성공", () => {
                cy.intercept({
                    method: "DELETE",
                    url: "/api/delivery/delivery-info/*"
                }, {
                    statusCode: 200
                }).as("deleteAddress")

                cy.fixture('profileEdit/addressList.json').then((addressFixture) => {
                    cy.intercept("GET", "/api/delivery/delivery-info", (req) => {
                        const updatedResponse = addressFixture.filter((item: any) => item.id !== 1)
                        req.reply(updatedResponse)
                    }).as("getAddressList")
                })
                
                // when - 배송지의 삭제 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="address-delete-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="delete-address-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="delete-address-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@deleteAddress').its('response.statusCode').should('eq', 200)
                cy.wait('@getAddressList').its('response.statusCode').should('eq', 200)

                // then - 배송지 리스트 확인, 2번째 배송지 삭제됨
                cy.get('[data-cy="address-list-item"]').should('have.length', 2)         
            })
        })

        describe("유저 배송지 삭제 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept({
                    method: "DELETE",
                    url: "/api/delivery/delivery-info/*"
                }, {
                    statusCode: 500
                }).as("deleteAddress")

                // when - 배송지의 삭제 버튼 클릭, 모달 창 노출, 확인 버튼 클릭
                cy.get('[data-cy="address-delete-button"]').eq(1).should('be.visible').click()

                cy.get('[data-cy="delete-address-confirm-modal"]').should('be.visible')
                cy.get('[data-cy="delete-address-confirm-modal"]').get('[data-cy="confirm-button"]').should('be.visible').click()

                cy.wait('@deleteAddress').its('response.statusCode').should('eq', 500)

                // then - 서버 에러 확인, 버튼 활성화
                cy.checkErrorTopToast('배송지 삭제 실패', '다시 시도해주세요.')

                cy.get('[data-cy="delete-address-confirm-modal"]').should('be.visible').as('deleteAddressConfirmModal')
                cy.get('@deleteAddressConfirmModal').get('[data-cy="cancel-button"]').should('be.visible').click()

                cy.get('[data-cy="default-address-mark"]').first().should('be.visible')
                cy.get('[data-cy="address-delete-button"]').eq(1).should('be.visible')
                cy.get('[data-cy="address-list-item"]').should('have.length', 3)
            })
        })
    })
})