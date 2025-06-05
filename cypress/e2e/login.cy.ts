describe("로그인", () => {
  beforeEach(() => {
    // given - 로그인 모달 오픈, 로그인 버튼 disabled 확인
    cy.visitMainPage()
    cy.get('header').get('[data-cy="open-login-modal-button"]').should('be.visible').click()
    cy.get('[data-cy="login-modal"]').as('loginModal').should('be.visible')
    cy.get('@loginModal').get('[data-cy="login-button"]').should('be.disabled')
  })

  describe("로그인 성공 케이스", () => {
    it("유효한 폼 작성 후 로그인 버튼 클릭하면 로그인 성공", () => {
      cy.intercept({
        method: "POST",
        url: "/api/user/login"
      }, {
        statusCode: 200,
        body: {
          accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6IuqwgOyehe2FjOyKpO2KuCIsImlhdCI6MTc0ODk2ODQ0MSwiZXhwIjoxNzQ5NTczMjQxfQ.8QkpyGU8Mf9Mh2xSTzlmHCapyxQZONR81ZHcv_GQ2b4",
          userId: 57
        }
      }).as('login')

      cy.intercept({
        method: "GET",
        url: "/api/user/Header"
      }, {
        statusCode: 200,
        body: {
          nickname: "테스트유저",
          imageUrl: "data:image/jpeg;base64,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"
        }
      }).as('login')

      cy.intercept({
        method: "POST",
        url: "/api/fcm/register"
      }).as('fcmRegister')

      // when - 로그인 요청
      cy.get('@loginModal').get('[data-cy="email-input"]').type("test@test.com")
      cy.get('@loginModal').get('[data-cy="password-input"]').type("Abc1234%") 
      cy.get('@loginModal').get('[data-cy="login-button"]').should('not.be.disabled').click()

      cy.wait('@login', { timeout: 5000 })

      // then - 로그인 성공
      cy.get('@loginModal').should('not.exist')
      cy.get('header').get('[data-cy="open-login-modal-button"]').should('not.exist')
      cy.get('header').get('[data-cy="open-signup-modal-button"]').should('not.exist')

      cy.get('header').get('[data-cy="user-nickname"]').should('be.visible').should('have.text', '테스트유저')
      cy.get('header').get('[data-cy="user-image-button"]').should('be.visible')
      cy.get('header').get('[data-cy="user-image"]').should('be.visible').should('have.attr', 'src').should('include', 'data:image/jpeg;base64')
    })
  })

  describe("로그인 불가 케이스", () => {
    afterEach(() => {
      // then - 로그인 버튼 비활성화
      cy.get('@loginModal').get('[data-cy="login-button"]').should('be.disabled')
    })

    describe("이메일 유효성 오류 시 로그인 불가", () => {
      it("이메일 미입력 시 로그인 불가", () => {
        // when - 로그인 요청
        cy.get('@loginModal').get('[data-cy="password-input"]').type("Abc1234%")
      })

      it("이메일 작성, 삭제 시 로그인 불가, 에러메세지 출력", () => {
        // when - 로그인 요청
        cy.get('@loginModal').get('[data-cy="email-input"]').type("test@test.com")
        cy.get('@loginModal').get('[data-cy="password-input"]').type("Abc1234%")

        cy.get('@loginModal').get('[data-cy="login-button"]').should('not.be.disabled')

        cy.get('@loginModal').get('[data-cy="email-input"]').type('{selectall}{backspace}')

        // then - 에러메세지 확인
        cy.get('@loginModal').get('[data-cy="email-error-message"]').should('be.visible')
      })
    })

    describe("비밀번호 유효성 오류 시 로그인 불가", () => {
      it("비밀번호 미입력 시 로그인 불가", () => {
        // when - 로그인 요청
        cy.get('@loginModal').get('[data-cy="email-input"]').type("test@test.com")
      })

      it("비밀번호 작성, 삭제 시 로그인 불가, 에러메세지 출력", () => {
        // when - 로그인 요청
        cy.get('@loginModal').get('[data-cy="email-input"]').type("test@test.com")
        cy.get('@loginModal').get('[data-cy="password-input"]').type("Abc1234%")

        cy.get('@loginModal').get('[data-cy="login-button"]').should('not.be.disabled')

        cy.get('@loginModal').get('[data-cy="password-input"]').type('{selectall}{backspace}')

        // then - 에러메세지 확인
        cy.get('@loginModal').get('[data-cy="password-error-message"]').should('be.visible')
      })
    })
  })

  describe("로그인 실패 케이스", () => {
    beforeEach(() => {
      // given - 로그인 모달 오픈
      cy.visit('/')
      cy.get('[data-cy="open-login-modal-button"]').click()
      cy.get('[data-cy="login-modal"]').as('loginModal')
    })

    it("존재하지 않는 이메일로 로그인 시도 시 실패", () => {
      // when - 로그인 요청
      cy.get('@loginModal').get('[data-cy="email-input"]').type("notexist@test.com")
      cy.get('@loginModal').get('[data-cy="password-input"]').type("Abc1234%")
      cy.get('@loginModal').get('[data-cy="login-button"]').click()

      // then - 에러메세지 확인
      cy.contains("로그인에 실패했습니다.").should('be.visible')
    })

    it("잘못된 비밀번호로 로그인 시도 시 실패", () => {
      // when - 로그인 요청  
      cy.get('@loginModal').get('[data-cy="email-input"]').type("test@test.com")
      cy.get('@loginModal').get('[data-cy="password-input"]').type("WrongPassword123!")
      cy.get('@loginModal').get('[data-cy="login-button"]').click()

      // then - 에러메세지 확인
      cy.contains("로그인에 실패했습니다.").should('be.visible')
    })

    it("서버 오류 발생 시 로그인 실패", () => {
      // given - 서버 오류 응답 설정
      cy.intercept('POST', '/api/user/login', {
        statusCode: 500,
        body: { message: "Internal Server Error" }
      }).as('loginRequest')

      // when - 로그인 요청
      cy.get('@loginModal').get('[data-cy="email-input"]').type("test@test.com")
      cy.get('@loginModal').get('[data-cy="password-input"]').type("Abc1234%")
      cy.get('@loginModal').get('[data-cy="login-button"]').click()

      // then - 에러메세지 확인
      cy.contains("로그인에 실패했습니다.").should('be.visible')
    })
  })
})
