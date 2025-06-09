describe("관리자 상호작용", () => {
    beforeEach(() => {
        cy.fixture('admin/approval/projectList.json').then((projectList) => {
            cy.intercept('GET', '/api/admin/project?page=0&direction=asc', projectList)
        })

        // given - 로그인 후 헤더 확인
        cy.visitMainPage()
        cy.adminLogin()
        
        // 로그인 모달이 사라질 때까지 대기
        cy.get('[data-cy="login-modal"]').should('not.exist')
        
        // 헤더 요소들이 보이는지 확인
        cy.get('header').should('be.visible')
        cy.get('header').get('[data-cy="user-nickname"]').should('be.visible')
        cy.get('header').get('[data-cy="user-image"]').should('be.visible').as('userProfileImage')
    })

    describe("회원 메뉴 확인", () => {
        beforeEach(() => {
            // given - 회원 메뉴 확인
            cy.get('@userProfileImage').click()

            cy.get('header').get('[data-cy="user-menu"]').should('be.visible').as('userMenu')
            cy.get('@userMenu').get('[data-cy="adminpage-button"]').should('be.visible').as('adminMenu')
            cy.get('@userMenu').get('[data-cy="mypage-button"]').should('be.visible').as('mypageButton')
            cy.get('@userMenu').get('[data-cy="logout-button"]').should('be.visible').as('logoutButton')
        })

        it("관리자 메뉴 클릭 시 관리자 페이지로 이동", () => {
            cy.get('@adminMenu').click()
            cy.url().should('include', '/admin')
        })
    })
})