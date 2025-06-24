describe("사용자 인터랙션", () => {
    beforeEach(() => {
        // given - 메인 페이지 방문
        cy.visitMainPage()
        cy.login()
    })

    describe("로그인 시 닉네임, 프로필 사진 확인", () => {
        it("로그인", () => {
            // then - 헤더 내 로그인, 회원가입 버튼 not.exist 확인, 헤더 내 닉네임, 프로필 사진 visible 확인
            cy.get('[data-cy="login-button"]').should('not.exist')
            cy.get('[data-cy="signup-button"]').should('not.exist')
            cy.get('[data-cy="user-nickname"]').should('be.visible')
            cy.get('[data-cy="user-image"]').should('be.visible')
        })
    })

    describe("사용자 메뉴", () => {
        describe("프로필 사진 클릭 시 사용자 메뉴 표시", () => {
            it("프로필 사진 클릭", () => {
                // when - 프로필 사진 클릭
                cy.get('[data-cy="user-image"]').click()

                // then - 사용자 메뉴 visible 확인, 사용자 메뉴 내 '마이페이지', '로그아웃' 버튼 확인
                cy.get('[data-cy="user-menu"]').should('be.visible')
                cy.get('[data-cy="user-menu"]').find('[data-cy="mypage-button"]').should('be.visible')
                cy.get('[data-cy="user-menu"]').find('[data-cy="logout-button"]').should('be.visible')
            })
        })

        describe("마이페이지 이동", () => {
            it("마이페이지 버튼 클릭", () => {
                // given - 프로필 사진 클릭
                cy.get('[data-cy="user-image"]').click()
                cy.get('[data-cy="user-menu"]').should('be.visible')

                // when - 마이페이지 버튼 클릭
                cy.get('[data-cy="mypage-button"]').click()

                // then - 마이페이지 요청 API들 확인
                cy.url().should('include', '/my')
            })
        })

        describe("로그아웃", () => {
            it("로그아웃 버튼 클릭", () => {
                // given - 프로필 사진 클릭
                cy.get('[data-cy="user-image"]').click()
                cy.get('[data-cy="user-menu"]').should('be.visible')

                // given - 로그아웃 API 응답 설정
                cy.intercept({
                    method: "POST",
                    url: "/api/user/logout"
                }, {
                    statusCode: 200,
                }).as('logout')

                // when - 로그아웃 버튼 클릭
                cy.get('[data-cy="logout-button"]').click()

                // then - 로그아웃 API 확인, 로그인, 회원가입 버튼 visible 확인
                cy.wait('@logout').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="open-login-modal-button"]').should('be.visible')
                cy.get('[data-cy="open-signup-modal-button"]').should('be.visible')
                cy.get('[data-cy="user-nickname"]').should('not.exist')
                cy.get('[data-cy="user-image"]').should('not.exist')
            })
        })
    })
})