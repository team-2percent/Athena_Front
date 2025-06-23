describe("회원가입", () => {
    beforeEach(() => {
        // given - 회원가입 모달 오픈, 회원가입 버튼 disabled 확인
        cy.visitMainPage()
        cy.get('header').get('[data-cy="open-signup-modal-button"]').should('be.visible').click()
        cy.get('[data-cy="signup-modal"]').as('signupModal').should('be.visible')
        cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
    })

    describe("입력값 유효성 검증", () => {
        describe("모두 유효한 입력 작성 시 회원가입 가능", () => {
            it("모든 필드 입력 시 회원가입 버튼 활성화", () => {
                // when - 유효한 입력값 작성
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")

                // then - 회원가입 버튼 활성화
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')
            })
        })

        describe("입력값 공란", () => {
            it("닉네임 공란 시 회원가입 불가", () => {
                // when - 모든 필드 입력 후 닉네임 삭제
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')
                cy.get('@signupModal').get('[data-cy="nickname-input"]').clear()

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="nickname-error-message"]').should('be.visible')
            })

            it("이메일 공란 시 회원가입 불가", () => {
                // when - 모든 필드 입력 후 이메일 삭제
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')
                cy.get('@signupModal').get('[data-cy="email-input"]').clear()

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="email-error-message"]').should('be.visible')
            })

            it("비밀번호 공란 시 회원가입 불가", () => {
                // when - 모든 필드 입력 후 비밀번호 삭제
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')
                cy.get('@signupModal').get('[data-cy="password-input"]').clear()

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="password-error-message"]').should('be.visible')
            })

            it("비밀번호 확인 공란 시 회원가입 불가", () => {
                // when - 모든 필드 입력 후 비밀번호 확인 삭제
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').clear()

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="confirm-password-error-message"]').should('be.visible')
            })
        })

        describe("입력값 형식 오류", () => {
            it("이메일 형식 오류 시 회원가입 불가", () => {
                // when - 이메일 형식이 아닌 문자열 입력
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("invalid-email")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="email-error-message"]').should('be.visible')
            })

            it("비밀번호 형식 오류 시 회원가입 불가", () => {
                // when - 비밀번호 형식이 아닌 문자열 입력
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("abc1234")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("abc1234")

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="password-error-message"]').should('be.visible')
            })
        })

        describe("입력값 제한 초과", () => {
            it("닉네임 길이 제한 초과 시 슬라이싱", () => {
                // when - 닉네임 길이 제한 초과 입력
                const longNickname = "테스트유저" + "a".repeat(50)
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type(longNickname)

                // then - 닉네임 input text의 길이 확인 및 에러메세지 표시
                cy.get('[data-cy="nickname-input"]').then(($input) => {
                    expect($input.val().length).to.be.lte(50)
                })
                cy.get('[data-cy="nickname-error-message"]').should('be.visible')
            })

            it("이메일 길이 제한 초과 시 슬라이싱", () => {
                // when - 이메일 길이 제한 초과 입력
                const longEmail = "test@test.com" + "a".repeat(40)
                cy.get('@signupModal').get('[data-cy="email-input"]').type(longEmail)

                // then - 이메일 input text의 길이 확인 및 에러메세지 표시
                cy.get('[data-cy="email-input"]').then(($input) => {
                    expect($input.val().length).to.be.lte(50)
                })
                cy.get('[data-cy="email-error-message"]').should('be.visible')
            })

            it("비밀번호 길이 제한 초과 시 슬라이싱", () => {
                // when - 비밀번호 길이 제한 초과 입력
                const longPassword = "Abc1234%" + "a".repeat(100)
                cy.get('@signupModal').get('[data-cy="password-input"]').type(longPassword)

                // then - 비밀번호 input text의 길이 확인 및 에러메세지 표시
                cy.get('[data-cy="password-input"]').then(($input) => {
                    expect($input.val().length).to.be.lte(100)
                })
                cy.get('[data-cy="password-error-message"]').should('be.visible')
            })

            it("비밀번호 확인 길이 제한 초과 시 슬라이싱", () => {
                // when - 비밀번호 확인 길이 제한 초과 입력
                const longConfirmPassword = "Abc1234%" + "a".repeat(100)
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type(longConfirmPassword)

                // then - 비밀번호 확인 input text의 길이 확인 및 에러메세지 표시
                cy.get('[data-cy="confirm-password-input"]').then(($input) => {
                    expect($input.val().length).to.be.lte(100)
                })
                cy.get('[data-cy="confirm-password-error-message"]').should('be.visible')
            })

            it("비밀번호와 비밀번호 확인 불일치 시 회원가입 불가", () => {
                // when - 비밀번호와 다른 비밀번호 확인 입력
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234^")

                // then - 회원가입 버튼 비활성화 및 에러메세지 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
                cy.get('@signupModal').get('[data-cy="confirm-password-error-message"]').should('be.visible')
            })
        })
    })

    describe("회원가입", () => {
        beforeEach(() => {
            // given - 유효한 입력값 작성
            cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
            cy.get('@signupModal').get('[data-cy="email-input"]').type("test@test.com")
            cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')
        })

        describe("회원가입 로딩", () => {
            it("회원가입 버튼 클릭 시 스피너 표시", () => {
                // given - API 응답 설정 (지연 포함)
                cy.intercept({
                    method: "POST",
                    url: "/api/user"
                }, {
                    statusCode: 200,
                    delay: 1000
                }).as('signupLoading')

                // when - 회원가입 버튼 클릭
                cy.get('@signupModal').get('[data-cy="signup-button"]').click()

                // then - 회원가입 버튼 내 스피너 표시
                cy.get('@signupModal').get('[data-cy="signup-button"]').should('have.attr', 'data-loading', 'true')
            })
        })

        describe("회원가입 성공", () => {
            it("유효한 계정으로 회원가입 성공", () => {
                // given - API 응답 설정
                cy.intercept({
                    method: "POST",
                    url: "/api/user"
                }, {
                    statusCode: 200,
                }).as('signup')

                // when - 회원가입 버튼 클릭
                cy.get('@signupModal').get('[data-cy="signup-button"]').click()

                // then - API 응답 대기 및 확인
                cy.wait('@signup').its('response.statusCode').should('eq', 200)

                // then - UI 상태 확인
                cy.get('@signupModal').should('not.exist')
                cy.get('header').get('[data-cy="open-login-modal-button"]').should('be.visible')
                cy.get('header').get('[data-cy="open-signup-modal-button"]').should('be.visible')
            })
        })

        describe("회원가입 실패", () => {
            it("이미 존재하는 이메일 회원가입 실패", () => {
                // given - API 응답 설정
                cy.intercept({
                    method: "POST",
                    url: "/api/user"
                }, {
                    statusCode: 400,
                    body: {
                        message: "이미 존재하는 이메일입니다."
                    }
                }).as('signupError400')

                // when - 회원가입 버튼 클릭
                cy.get('@signupModal').get('[data-cy="signup-button"]').click()

                // then - API 응답 대기 및 에러메세지 확인
                cy.wait('@signupError400').its('response.statusCode').should('eq', 400)
                cy.get('@signupModal').should('exist')
                cy.get('@signupModal').get('[data-cy="signup-error-message"]').should('be.visible')
            })

            it("서버 에러 회원가입 실패", () => {
                // given - API 응답 설정
                cy.intercept({
                    method: "POST",
                    url: "/api/user"
                }, {
                    statusCode: 500
                }).as('signupError500')

                // when - 회원가입 버튼 클릭
                cy.get('@signupModal').get('[data-cy="signup-button"]').click()

                // then - API 응답 대기 및 에러메세지 확인
                cy.wait('@signupError500').its('response.statusCode').should('eq', 500)
                cy.get('@signupModal').should('exist')
                cy.get('@signupModal').get('[data-cy="signup-error-message"]').should('be.visible')
            })
        })
    })
})