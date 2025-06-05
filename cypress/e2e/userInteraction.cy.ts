// 쿠폰 발급 테스트 데이터
const body = [
    {
      "id": 53,
      "title": "쿠폰 테스트",
      "content": "설명은 10자 이상이 되어야합니다.",
      "stock": 100,
      "price": 40000,
      "expiresAt": "2025-06-29T16:00:00",
      "userIssued": false
    },
    {
      "id": 13,
      "title": "Previous Coupon 12",
      "content": "Start in future",
      "stock": 13,
      "price": 2100,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 12,
      "title": "Previous Coupon 11",
      "content": "Start in future",
      "stock": 11,
      "price": 2000,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 11,
      "title": "Previous Coupon 10",
      "content": "Start in future",
      "stock": 16,
      "price": 1900,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 10,
      "title": "Previous Coupon 09",
      "content": "Start in future",
      "stock": 14,
      "price": 1800,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 9,
      "title": "Previous Coupon 08",
      "content": "Start in future",
      "stock": 17,
      "price": 1700,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 8,
      "title": "Previous Coupon 07",
      "content": "Start in future",
      "stock": 8,
      "price": 1600,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 7,
      "title": "Previous Coupon 06",
      "content": "Start in future",
      "stock": 12,
      "price": 1400,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 6,
      "title": "Previous Coupon 05",
      "content": "Start in future",
      "stock": 30,
      "price": 1300,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 5,
      "title": "Previous Coupon 04",
      "content": "Start in future",
      "stock": 25,
      "price": 1100,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    },
    {
      "id": 4,
      "title": "Previous Coupon 03",
      "content": "Start in future",
      "stock": 20,
      "price": 1500,
      "expiresAt": "2025-06-15T23:59:59",
      "userIssued": false
    }
]

const bodyAfterIssue = body.map((c) =>
    c.id === 53 ? { ...c, userIssued: true } : c
);

describe("회원 상호작용", () => {
    beforeEach(() => {
        // given - 로그인 후 헤더 확인
        cy.visitMainPage()
        cy.login()
        
        // 로그인 모달이 사라질 때까지 대기
        cy.get('[data-cy="login-modal"]').should('not.exist')
        
        // 헤더 요소들이 보이는지 확인
        cy.get('header').should('be.visible')
        cy.get('header').get('[data-cy="user-nickname"]').should('be.visible')
        cy.get('header').get('[data-cy="user-image"]').should('be.visible').as('userProfileImage')
        cy.get('header').get('[data-cy="coupon-event-modal-button"]').should('be.visible').as('couponEventModalButton')
        // cy.get('header').get('[data-cy="notification-button"]').should('be.visible').as('notificationButton')
    })
    describe("회원 메뉴 확인", () => {
        beforeEach(() => {
            // given - 회원 메뉴 확인
            cy.get('@userProfileImage').click()
            cy.get('header').get('[data-cy="user-menu"]').should('be.visible').as('userMenu')
            cy.get('@userMenu').get('[data-cy="mypage-button"]').should('be.visible').as('mypageButton')
            cy.get('@userMenu').get('[data-cy="logout-button"]').should('be.visible').as('logoutButton')
        })

        it("회원 메뉴 클릭 시 마이페이지 페이지로 이동", () => {
            cy.get('@mypageButton').click()
            cy.url().should('include', '/my')
        })

        it("회원 메뉴 클릭 시 로그아웃 버튼 클릭 시 로그아웃", () => {
            cy.intercept({
                method: "POST",
                url: "/api/user/logout"
            }, {
                statusCode: 200,
            }).as('logout')

            cy.get('@logoutButton').click()
            cy.url().should('include', '/')
            cy.get('header').get('[data-cy="user-nickname"]').should('not.exist')
            cy.get('header').get('[data-cy="user-profile-image"]').should('not.exist')
            cy.get('header').get('[data-cy="coupon-event-modal-button"]').should('not.exist')
            cy.get('header').get('[data-cy="notification-button"]').should('not.exist')
        })
    })

    describe("쿠폰 이벤트 확인", () => {
        beforeEach(() => {
            // given - 쿠폰 이벤트 버튼 확인
            cy.intercept({
                method: "GET",
                url: "/api/coupon/getInProgress"
            }, {
                statusCode: 200,
                body: body
            }).as('getCouponEvent')

            cy.get('@couponEventModalButton').click()
            cy.get('header').get('[data-cy="coupon-event-modal"]').should('be.visible').as('couponEventModal')
            cy.get('@couponEventModal').get('[data-cy="coupon-issue-button"]').should('not.be.disabled').as('couponIssueButton')
            cy.wait('@getCouponEvent')
        })

        it("쿠폰 발급받기 버튼 클릭 시 발급 완료로 전환", () => {
            cy.intercept({
                method: "POST", 
                url: "/api/userCoupon",
            }, {
                statusCode: 200,
            }).as('issueCoupon')

            // 발급 이후 다시 요청되었을 때 응답 변경
            cy.intercept("GET", "/api/coupon/getInProgress", (req) => {
                req.reply({
                statusCode: 200,
                body: bodyAfterIssue,
                });
            }).as("getCouponAfterIssue");

            cy.get('[data-cy="coupon-issue-button"]').first().click();

            cy.wait("@issueCoupon");
            cy.wait("@getCouponAfterIssue");

            // 버튼이 비활성화 되었는지 확인
            cy.get('[data-cy="coupon-issue-button"]').first().should("be.disabled");
        })
    })

    describe("알림 확인", () => {
    })
})