import { PASSWORD_MIN_LENGTH } from "../../src/lib/validationConstant"

describe("회원가입", () => {
    beforeEach(() => {
        // given - 회원가입 모달 오픈, 회원가입 버튼 disabled 확인
        cy.visitMainPage()
        cy.get('header').get('[data-cy="open-signup-modal-button"]').should('be.visible').click()
        cy.get('[data-cy="signup-modal"]').as('signupModal').should('be.visible')
        cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
    })

    describe("회원가입 성공 케이스", () => {
        it("유효한 폼 작성 후 회원가입 버튼 클릭하면 회원가입 성공", () => {
            cy.intercept({
                method: "POST",
                url: "/api/user"
            }, {
                statusCode: 200,
                body: {
                    userId: 123,
                    email: "gaip@test.com",
                    nickname: "테스트유저"
                }
            }).as('signup')

            // when - 회원가입 요청
            cy.get('@signupModal').get('[data-cy="nickname-input"]').type("테스트유저")
            cy.get('@signupModal').get('[data-cy="email-input"]').type("new@test.com")
            cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled').click()

            cy.wait(1000)

            // then - 회원가입 성공
            cy.get('@signupModal').should('not.exist')
            cy.get('header').get('[data-cy="open-login-modal-button"]').should('be.visible')
            cy.get('header').get('[data-cy="open-signup-modal-button"]').should('be.visible')
        })
    })

    describe("회원가입 불가 케이스", () => {
        afterEach(() => {
            // then - 회원가입 버튼 비활성화
            cy.get('@signupModal').get('[data-cy="signup-button"]').should('be.disabled')
        })

        describe("닉네임 유효성 오류 시 회원가입 불가", () => {
            it("닉네임 미입력 시 회원가입 불가", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
            })

            it("닉네임 작성, 삭제 시 회원가입 불가, 에러메세지 출력", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")

                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')

                cy.get('@signupModal').get('[data-cy="nickname-input"]').type('{selectall}{backspace}')

                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="nickname-error-message"]').should('be.visible')
            })
        })

        describe("이메일 유효성 오류 시 회원가입 불가", () => {
            it("이메일 미입력 시 회원가입 불가", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
            })

            it("이메일 작성, 삭제 시 회원가입 불가, 에러메세지 출력", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")

                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')

                cy.get('@signupModal').get('[data-cy="email-input"]').type('{selectall}{backspace}')

                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="email-error-message"]').should('be.visible')
            })

            it("이메일 형식 오류 시 회원가입 불가", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaiptest")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
    
                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="email-error-message"]').should('be.visible')
            })
        })  

        describe("비밀번호 유효성 오류 시 회원가입 불가", () => {
            it("비밀번호 미입력 시 회원가입 불가", () => {
                // when - 회원가입 요청
            })

            it("비밀번호 작성, 삭제 시 회원가입 불가, 에러메세지 출력", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")

                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')

                cy.get('@signupModal').get('[data-cy="password-input"]').type('{selectall}{backspace}')

                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="password-error-message"]').should('be.visible')
            })

            it(`비밀번호 ${PASSWORD_MIN_LENGTH}자 미만 시 회원가입 불가`, () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234")
    
                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="password-error-message"]').should('be.visible')
            })
    
            it("비밀번호 형식 오류 시 회원가입 불가", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("abc1234%")
    
                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="password-error-message"]').should('be.visible')
            })
        })
        
        describe("비밀번호 확인 유효성 오류 시 회원가입 불가", () => {
            it("비밀번호 확인 미입력 시 회원가입 불가", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
    
                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="confirm-password-error-message"]').should('be.visible')
            })

            it("비밀번호 확인, 삭제 시 회원가입 불가, 에러메세지 출력", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")

                cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled')

                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type('{selectall}{backspace}')

                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="confirm-password-error-message"]').should('be.visible')
            })

            it("비밀번호, 비밀번호 확인 비일치 시 회원가입 불가", () => {
                // when - 회원가입 요청
                cy.get('@signupModal').get('[data-cy="nickname-input"]').type("불가테스트유저")
                cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
                cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
                cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234^")

                // then - 에러메세지 확인
                cy.get('@signupModal').get('[data-cy="confirm-password-error-message"]').should('be.visible')
            })
        })
    })

    describe("회원가입 실패 케이스", () => {
        it("이미 존재하는 이메일 입력 후 회원가입 버튼 클릭하면 회원가입 실패", () => {
            cy.intercept({
                method: "POST",
                url: "/api/user/signup"
            }, {
                statusCode: 400,
                body: {
                    message: "이미 존재하는 이메일입니다."
                }
            })

            // when - 회원가입 요청
            cy.get('@signupModal').get('[data-cy="nickname-input"]').type("실패테스트유저")
            cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
            cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled').click()

            // then - 회원가입 실패
            cy.get('@signupModal').should('exist')
            cy.get('@signupModal').get('[data-cy="signup-error-message"]').should('be.visible')
        })

        it("서버 오류 시 회원가입 실패", () => {
            cy.intercept({
                method: "POST",
                url: "/api/user/signup"
            }, {
                statusCode: 500,
            })

            // when - 회원가입 요청
            cy.get('@signupModal').get('[data-cy="nickname-input"]').type("실패테스트유저")
            cy.get('@signupModal').get('[data-cy="email-input"]').type("gaip@test.com")
            cy.get('@signupModal').get('[data-cy="password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="confirm-password-input"]').type("Abc1234%")
            cy.get('@signupModal').get('[data-cy="signup-button"]').should('not.be.disabled').click()

            // then - 회원가입 실패
            cy.get('@signupModal').should('exist')
            cy.get('@signupModal').get('[data-cy="signup-error-message"]').should('be.visible')
        })
    })
})