describe("사용자 쿠폰 이벤트 조회 및 발급", () => {
  beforeEach(() => {
    // given - 메인 페이지 방문 및 로그인
    cy.visitMainPage()
    cy.login()
  })

  describe("쿠폰 모달 버튼 확인", () => {
    it("쿠폰 모달 버튼 클릭", () => {
      // given - 쿠폰 리스트 API 응답 설정
      cy.fixture('couponEvent.json').then((couponEvent) => {
        cy.intercept({
          method: "GET",
          url: "/api/coupon/getInProgress"
        }, {
          statusCode: 200,
          body: couponEvent
        }).as('getCouponEvent')
      })

      // then - 쿠폰 모달 버튼 visible 확인, 쿠폰 모달 버튼 클릭
      cy.get('[data-cy="coupon-event-modal-button"]').should('be.visible')
      cy.get('[data-cy="coupon-event-modal-button"]').click()

      // then - 쿠폰 리스트 API 요청 확인, 쿠폰 모달 visible 확인
      cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="coupon-event-modal"]').should('be.visible')

      // then - 닫기 버튼 visible 확인, 클릭
      cy.get('[data-cy="coupon-event-modal"]').find('button').contains('닫기').should('be.visible')
      cy.get('[data-cy="coupon-event-modal"]').find('button').contains('닫기').click()

      // then - 쿠폰 모달 not exist 확인
      cy.get('[data-cy="coupon-event-modal"]').should('not.exist')
    })
  })

  describe("쿠폰 조회", () => {
    describe("조회 로딩 중 스켈레톤 표시", () => {
      it("쿠폰 GET API 요청 중", () => {
        // given - 쿠폰 리스트 API 응답 설정 (지연 포함)
        cy.fixture('couponEvent.json').then((couponEvent) => {
          cy.intercept({
            method: "GET",
            url: "/api/coupon/getInProgress"
          }, {
            ...couponEvent,
            delay: 1000
          }).as('getCouponEvent')
        })

        // when - 쿠폰 모달 버튼 클릭
        cy.get('[data-cy="coupon-event-modal-button"]').click()

        // then - 쿠폰 리스트 스켈레톤 visible 확인
        cy.get('[data-cy="coupon-list-skeleton"]').should('be.visible')
      })
    })

    describe("조회 성공 시 쿠폰 리스트 표시", () => {
      it("쿠폰 GET API 200", () => {
        // given - 쿠폰 리스트 API 응답 설정
        cy.fixture('couponEvent.json').then((couponEvent) => {
          cy.intercept({
            method: "GET",
            url: "/api/coupon/getInProgress"
          }, {
            statusCode: 200,
            body: couponEvent
          }).as('getCouponEvent')
        })

        // when - 쿠폰 모달 버튼 클릭
        cy.get('[data-cy="coupon-event-modal-button"]').click()

        // then - 쿠폰 조회 API 200 확인, 쿠폰 리스트 visible 확인
        cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="coupon-list-item"]').should('be.visible')
      })
    })

    describe("데이터 없을 시 비어있음 메시지 표시", () => {
      it("쿠폰 GET API 200, 데이터 없음", () => {
        // given - 쿠폰 리스트 API 응답 설정 (빈 데이터)
        cy.intercept({
          method: "GET",
          url: "/api/coupon/getInProgress"
        }, {
          statusCode: 200,
          body: []
        }).as('getCouponEvent')

        // when - 쿠폰 모달 버튼 클릭
        cy.get('[data-cy="coupon-event-modal-button"]').click()

        // then - 쿠폰 조회 API 200 확인, 쿠폰 개수 0개 확인, 비어있음 메시지 visible 확인
        cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="coupon-list-item"]').should('have.length', 0)
        cy.get('[data-cy="empty-message"]').should('be.visible')
      })
    })

    describe("조회 실패 시 서버에러 메시지 표시", () => {
      it("쿠폰 GET API 500", () => {
        // given - 쿠폰 리스트 API 응답 설정 (서버 에러)
        cy.intercept({
          method: "GET",
          url: "/api/coupon/getInProgress"
        }, {
          statusCode: 500
        }).as('getCouponEvent')

        // when - 쿠폰 모달 버튼 클릭
        cy.get('[data-cy="coupon-event-modal-button"]').click()

        // then - 쿠폰 조회 API 500 확인, 쿠폰 개수 0개 확인, 서버에러 메시지 visible 확인
        cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 500)
        cy.get('[data-cy="coupon-list-item"]').should('have.length', 0)
        cy.get('[data-cy="server-error-message"]').should('be.visible')
      })
    })
  })

  describe("쿠폰 상태", () => {
    describe("발급 가능 시 발급 버튼 활성화", () => {
      it("쿠폰 조회 API 200 확인", () => {
        // given - 쿠폰 리스트 API 응답 설정 (발급 가능한 쿠폰)
        cy.fixture('couponEvent.json').then((couponEvent: any[]) => {
          const availableCoupon = [...couponEvent]
          availableCoupon[0].stock = 1
          cy.intercept({
            method: "GET",  
            url: "/api/coupon/getInProgress"
          }, {
            statusCode: 200,
            body: availableCoupon
          }).as('getCouponEvent')
        }) 

        // when - 쿠폰 모달 버튼 클릭 / 쿠폰 조회 API 200 확인
        cy.get('[data-cy="coupon-event-modal-button"]').click()
        cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)

        // then - 발급 버튼 활성화 확인, 발급 버튼 text '발급하기' 확인
        cy.get('[data-cy="coupon-issue-button"]').first().should('be.enabled')
        cy.get('[data-cy="coupon-issue-button"]').first().children('div').should('have.text', '발급받기')
      })
    })

    describe("이미 발급 시 발급 버튼 비활성화", () => {
      it("쿠폰 조회 API 200 확인", () => {
        // given - 쿠폰 리스트 API 응답 설정 (이미 발급된 쿠폰)
        cy.fixture('couponEvent.json').then((couponEvent: any[]) => {
          const issuedCoupon = [...couponEvent]
          issuedCoupon[0].userIssued = true
          cy.intercept({
            method: "GET",
            url: "/api/coupon/getInProgress"
          }, {
            statusCode: 200,
            body: issuedCoupon
          }).as('getCouponEvent')
        })

        // when - 쿠폰 모달 버튼 클릭 / 쿠폰 조회 API 200 확인
        cy.get('[data-cy="coupon-event-modal-button"]').click()
        cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)

        // then - 발급 버튼 disabled 확인, 발급 버튼 text '발급완료' 확인
        cy.get('[data-cy="coupon-issue-button"]').first().should('be.disabled')
        cy.get('[data-cy="coupon-issue-button"]').first().children('div').should('have.text', '발급완료')
      })
    })

    describe("발급 종료 시 발급 버튼 비활성화", () => {
      it("쿠폰 조회 API 200 확인", () => {
        // given - 쿠폰 리스트 API 응답 설정 (발급 종료된 쿠폰)
        cy.fixture('couponEvent.json').then((couponEvent: any[]) => {
          const endedCoupon = [...couponEvent]
          endedCoupon[0].stock = 0
          cy.intercept({
            method: "GET",
            url: "/api/coupon/getInProgress"
          }, {
            statusCode: 200,
            body: endedCoupon
          }).as('getCouponEvent')
        })

        // when - 쿠폰 모달 버튼 클릭 / 쿠폰 조회 API 200 확인
        cy.get('[data-cy="coupon-event-modal-button"]').click()
        cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)

        // then - 발급 버튼 disabled 확인, 발급 버튼 text '발급종료' 확인
        cy.get('[data-cy="coupon-issue-button"]').first().should('be.disabled')
        cy.get('[data-cy="coupon-issue-button"]').first().children('div').should('have.text', '발급종료')
      })
    })
  })

  describe("발급", () => {
    beforeEach(() => {
      // given - 쿠폰 모달 버튼 클릭
      cy.fixture('couponEvent.json').then((couponEvent) => {
        cy.intercept({
          method: "GET",
          url: "/api/coupon/getInProgress"
        }, {
          statusCode: 200,
          body: couponEvent
        }).as('getCouponEvent')
      })

      // when - 쿠폰 모달 버튼 클릭
      cy.get('[data-cy="coupon-event-modal-button"]').click()

      // then - 쿠폰 조회 API 200 확인
      cy.wait('@getCouponEvent').its('response.statusCode').should('eq', 200)
    })

    describe("발급 로딩 중 스켈레톤 표시", () => {
      it("쿠폰 조회 API 로딩 중", () => {
        // given - 쿠폰 리스트 API 응답 설정 (지연 포함)
        cy.fixture('couponEvent.json').then((couponEvent) => {
          cy.intercept({
            method: "GET",
            url: "/api/coupon/getInProgress"
          }, {
            ...couponEvent,
            delay: 1000
          }).as('getCouponEvent')
        })

        cy.intercept({
            method: "POST",
            url: "/api/userCoupon"
          }, {
            statusCode: 200,
            delay: 1000
        }).as('issueCoupon')

        // when - 쿠폰 조회 API 로딩 중, 발급 버튼 클릭
        cy.get('[data-cy="coupon-issue-button"]').first().click()

        // then - 발급 버튼 spinner 확인
        cy.get('[data-cy="coupon-list-skeleton"]').should('be.visible')
      })
    })

    describe("발급 성공 시 발급 버튼 비활성화", () => {
      it("쿠폰 조회 API 200", () => {
        // given - 쿠폰 리스트 API 응답 설정
        cy.fixture('couponEvent.json').then((couponEvent) => {
            const newCouponEvent = [...couponEvent]
            newCouponEvent[0].userIssued = true
          cy.intercept({
            method: "GET",
            url: "/api/coupon/getInProgress"
          }, {
            statusCode: 200,
            body: newCouponEvent
          }).as('getNewCouponEvent')
        })

        // given - 쿠폰 발급 API 응답 설정
        cy.intercept({
          method: "POST",
          url: "/api/userCoupon"
        }, {
          statusCode: 200
        }).as('issueCoupon')

        // when - 쿠폰 조회 API 200, 발급 버튼 클릭
        cy.get('[data-cy="coupon-issue-button"]').first().click()

        // then - 쿠폰 발급 API 200 확인, 쿠폰 발급 버튼 비활성화 확인, 쿠폰 발급 버튼 text '발급완료' 확인
        cy.wait('@issueCoupon').its('response.statusCode').should('eq', 200)
        cy.wait('@getNewCouponEvent').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="coupon-issue-button"]').first().should('be.disabled')
        cy.get('[data-cy="coupon-issue-button"]').first().children('div').should('have.text', '발급완료')
      })
    })

    describe("발급 실패 시 에러 토스트 표시", () => {
      it("쿠폰 조회 API 500", () => {
        // given - 쿠폰 발급 API 응답 설정 (서버 에러)
        cy.intercept({
          method: "POST",
          url: "/api/userCoupon"
        }, {
          statusCode: 500
        }).as('issueCoupon')

        // when -  발급 버튼 클릭
        cy.get('[data-cy="coupon-issue-button"]').first().click()

        // then - 쿠폰 발급 API 500 확인, 에러토스트 visible '쿠폰 발급 실패' 확인, 쿠폰 발급 버튼 활성화 확인, 쿠폰 발급 버튼 text '발급하기' 확인
        cy.wait('@issueCoupon').its('response.statusCode').should('eq', 500)
        cy.checkErrorTopToast("쿠폰 발급 실패", "쿠폰을 발급하는데 실패했습니다.")
      })
    })
  })
})
