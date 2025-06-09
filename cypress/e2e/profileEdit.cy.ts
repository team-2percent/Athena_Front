let userFixture: any
let accountFixture: any
let addressFixture: any

describe("프로필 편집 페이지", () => {
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

        // given - 로그인, 프로필 편집 페이지 접근
        cy.visitMainPage()
        cy.login()
        cy.visit("/my/edit")

        cy.wait('@getUserInfo').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy="menu-tab-계좌"]').should('be.visible').as("AccountTab")
        cy.get('[data-cy="menu-tab-배송지"]').should('be.visible').as("AddressTab")
        cy.get('[data-cy="menu-tab-탈퇴하기"]').should('be.visible').as("WithdrawTab")
    })

    describe("유저 인적사항 변경", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab-프로필"]').should('be.visible').should('have.class', 'text-main-color')
        })

        describe("유저 인적사항 변경 성공 케이스", () => {
            beforeEach(() => {
                // given - 처음 진입했을 때, 프로필 수정 탭 기본, 저장 버튼 비활성화
                cy.get('[data-cy="save-button"]').should('be.visible').should('be.disabled')
            })

            it("유효한 폼 작성 후 저장하면 성공", () => {
                cy.intercept("PUT", "/api/user", (req) => {
                    const updatedResponse = {
                        nickname: "테스트유저2",
                        imageUrl: "https://images.unsplash.com/photo-1542736705-53f0131d1e98?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGtpdHRlbnxlbnwwfHwwfHx8MA%3D%3D",
                        sellerDescription: "안녕하세요! 저는 프로젝트를 판매하고 있는 테스트유저입니다.\n열심히 하겠습니다!2",
                        linkUrl: "https://test2.com,https://test3.com"
                    }
                    req.reply(updatedResponse)
                }).as("putUserInfo")

                // when - 유저 인적사항 변경
                cy.get('[data-cy="nickname-input"]').should('be.visible').should('have.value', '테스트유저')
                cy.get('[data-cy="nickname-input"]').type("2")
                cy.get('[data-cy="save-button"]').should('be.enabled').as("saveButton")

                cy.get('[data-cy="profile-image-upload-button"]').click()
                cy.get('[data-cy="profile-image-upload-button"]').selectFile("cypress/fixtures/profileEdit/profileImageEditExample.jpg")

                cy.get('[data-cy="seller-description-input"]').should('be.visible').should('have.value', '안녕하세요! 저는 프로젝트를 판매하고 있는 테스트유저입니다.\n열심히 하겠습니다!')
                cy.get('[data-cy="seller-description-input"]').type("2")

                cy.get('[data-cy="link"]').should('have.length', 2)
                cy.get('[data-cy="link-url-remove-button"]').first().click()
                cy.get('[data-cy="toggle-link-url-add-form-button"]').click()
                cy.get('[data-cy="link-url-input"]').type("https://test3.com")
                cy.get('[data-cy="link-url-add-button"]').click()

                cy.get('[data-cy="link"]').should('have.length', 2)

                cy.get('@saveButton').should('be.enabled').click()

                // then - 저장 버튼 비활성화
                cy.wait('@putUserInfo').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="save-button"]').should('be.disabled')
            })
        })

        describe("유저 인적사항 변경 불가 케이스", () => {
            beforeEach(() => {
                // given - 처음 진입했을 때, 저장 버튼 비활성화
                cy.get('[data-cy="save-button"]').should('be.disabled')
            })

            it("닉네임 공란", () => {
                cy.get('[data-cy="nickname-input"]').clear()
                cy.get('[data-cy="nickname-error-message"]').should('be.visible')
                cy.get('[data-cy="save-button"]').should('be.disabled')
            })
        })

        describe("유저 인적사항 변경 실패 케이스", () => {
            beforeEach(() => {
                // given - 처음 진입했을 때, 저장 버튼 비활성화
                cy.get('[data-cy="save-button"]').should('be.disabled')
            })

            it("서버 오류 실패", () => {
                cy.intercept("PUT", "/api/user", (req) => {
                    req.reply(500)
                }).as("putUserInfo")
                cy.get('[data-cy="nickname-input"]').should('be.visible')
                cy.get('[data-cy="nickname-input"]').type("2")
                cy.get('[data-cy="save-button"]').should('be.enabled').click()

                cy.wait('@putUserInfo').its('response.statusCode').should('eq', 500)
                cy.get('[data-cy="save-button"]').should('be.enabled')
                cy.checkErrorTopToast('프로필 수정 실패', '다시 시도해주세요.')
            })
        })
    })

    describe("비밀번호 변경", () => {
        beforeEach(() => {
            // given - 비밀번호 변경 페이지 접근
            cy.get('[data-cy="password-change-button"]').click()
            cy.get('[data-cy="password-change-title"]').should('be.visible')
        })

        describe("비밀번호 변경 성공 케이스", () => {
            it("비밀번호 확인 완료, 유효한 폼 작성 후 비밀번호 변경 버튼 클릭하면 비밀번호 변경 성공", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/my/checkPassword"
                }, {
                    body: "true"
                }).as("checkPassword")
    
                cy.intercept({
                    method: "POST",
                    url: "/api/my/updatePassword"
                }, {
                    statusCode: 200
                }).as("updatePassword")

                cy.get('[data-cy="password-confirm-button"]').should('be.disabled')

                cy.get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('[data-cy="password-confirm-button"]').should('not.be.disabled').click()

                cy.wait('@checkPassword').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="password-confirm-success"]').should('be.visible')

                cy.get('[data-cy="new-password-input"]').type("Abc1234%")
                cy.get('[data-cy="new-password-confirm-input"]').type("Abc1234%")

                cy.get('[data-cy="password-save-button"]').should('be.enabled').click()

                cy.wait('@updatePassword').its('response.statusCode').should('eq', 200)

                cy.get('[data-cy="password-save-success-message"]').should('be.visible')
                cy.get('[data-cy="password-save-button"]').should('be.disabled')
            })
        })

        describe("비밀번호 변경 불가 케이스", () => {
            it("비밀번호 불일치로 인한 확인 실패", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/my/checkPassword"
                }, {
                    body: "false"
                }).as("checkPassword")
                
                // when - 비밀번호 불일치
                cy.get('[data-cy="password-input"]').type("Abc1234*")
                cy.get('[data-cy="password-confirm-button"]').should('not.be.disabled').click()

                // then - 에러메세지 확인, 버튼 비활성화
                cy.wait('@checkPassword').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="password-error-message"]').should('be.visible').should('contain', '비밀번호가 일치하지 않습니다.')
                cy.get('[data-cy="password-save-button"]').should('be.disabled')
            })

            it("비밀번호 확인 서버 오류로 인한 확인 실패", () => {
                cy.intercept("POST", "/api/my/checkPassword", {
                    statusCode: 500
                }).as("checkPassword")

                // when - 비밀번호 확인 서버 오류
                cy.get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('[data-cy="password-confirm-button"]').should('be.visible').click()

                // then - 에러메세지 확인, 버튼 비활성화
                cy.wait('@checkPassword').its('response.statusCode').should('eq', 500)
                cy.checkErrorTopToast('비밀번호 확인 실패', '다시 시도해주세요.')
                cy.get('[data-cy="password-save-button"]').should('be.disabled')
            })

            it("새 비밀번호 형식 오류", () => {
                // when - 새 비밀번호 형식 오류
                cy.get('[data-cy="password-input"]').type("abc1234*")

                // then - 에러메세지 확인, 버튼 비활성화
                cy.get('[data-cy="new-password-error-message"]').should('be.visible')
                cy.get('[data-cy="password-save-button"]').should('be.disabled')
            })

            it("새 비밀번호 확인 실패", () => {
                // when - 새 비밀번호 확인 실패
                cy.get('[data-cy="new-password-input"]').type("Abc1234%")
                cy.get('[data-cy="new-password-confirm-input"]').type("Abc1234%2")

                // then - 에러메세지 확인, 버튼 비활성화
                cy.get('[data-cy="new-password-confirm-error-message"]').should('be.visible')
                cy.get('[data-cy="password-save-button"]').should('be.disabled')
            })
        })

        describe("비밀번호 변경 실패 케이스", () => {
            it("서버 오류", () => {
                cy.intercept({
                    method: "POST",
                    url: "/api/my/checkPassword"
                }, {
                    body: "true"
                }).as("checkPassword")

                cy.intercept({
                    method: "POST",
                    url: "/api/my/updatePassword"
                }, {
                    statusCode: 500
                }).as("updatePassword")

                cy.get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('[data-cy="password-confirm-button"]').should('be.visible').click()

                cy.get('[data-cy="new-password-input"]').type("Abc1234%")
                cy.get('[data-cy="new-password-confirm-input"]').type("Abc1234%")

                cy.get('[data-cy="password-save-button"]').should('be.enabled').click()

                cy.wait('@updatePassword').its('response.statusCode').should('eq', 500)
                cy.checkErrorTopToast('비밀번호 변경 실패', '다시 시도해주세요.')
                cy.get('[data-cy="password-save-button"]').should('not.be.disabled')
            })
        })
    })  

    describe("유저 탈퇴", () => {
        before(() => {
            cy.get('@WithdrawTab').click()
            cy.get('@WithdrawTab').should('have.class', 'text-main-color')
        })

        describe("유저 탈퇴 성공 케이스", () => {})

        describe("유저 탈퇴 실패 케이스", () => {})
    })
})