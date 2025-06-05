describe("마이페이지", () => {
    beforeEach(() => {
        cy.intercept({
            method: "GET",
            url: "/api/user/Header"
        }, {
            fixture: "userHeader.json"
        }).as("getUserHeader");

        cy.intercept({
            method: "GET",
            url: "/api/user/57"
        }, {
            fixture: "my/user.json"
        }).as("getUser");

        cy.intercept({
            method: "GET",
            url: "/api/my/coupon"
        }, {
            fixture: "my/coupon.json"
        }).as("getMyCoupons");

        cy.intercept({
            method: "GET",
            url: "/api/my/project"
        }, {
            fixture: "my/project.json"
        }).as("getMyProjects");

        cy.intercept({
            method: "GET",
            url: "/api/my/project?nextCursorValue=2024-01-22T12:00:00&nextProjectId=11"
        }, {
            fixture: "my/nextProject.json"
        }).as("getMyProjects");

        cy.intercept({
            method: "GET",
            url: "/api/my/order"
        }, {
            fixture: "my/order.json"
        }).as("getMyOrders");

        cy.intercept({
            method: "GET",
            url: "/api/my/comment"
        }, {
            fixture: "my/comment.json"
        }).as("getMyComments");

        // when - 로그인 후 마이페이지 접근

        cy.login();

        cy.visit("/my");

        cy.wait('@getUserHeader')
        cy.wait('@getUser')

        cy.get('[data-cy="profile-header"]').should("be.visible").as("profileHeader");
        cy.get("@profileHeader").get('[data-cy="profile-image"]').should("be.visible");
        cy.get("@profileHeader").get('[data-cy="profile-nickname"]').should("be.visible");
        cy.get('[data-cy="menu-tab"]').should("be.visible").as("menuTab");
    });

    it("마이페이지 소개 확인", () => {
        // then
        // 소개 탭이 활성화되어 있는지 확인
        cy.get("@menuTab").get('[data-cy="menu-tab-소개"]').should('have.class', 'text-main-color')

        // 소개글과 링크 리스트 영역 확인
        cy.get('[data-cy="profile-seller-description"]').should('be.visible')
        cy.get('[data-cy="profile-link-list"]').should('be.visible')

        // 링크가 있다면 클릭하여 해당 URL로 이동 가능한지 확인
        cy.get('[data-cy="profile-link"]').each(($link) => {
            cy.wrap($link)
                .should('have.attr', 'href')
                .and('include', $link.text())
            cy.wrap($link)
                .should('have.attr', 'target', '_blank')
        })
    });

    it("마이페이지 보유 쿠폰 확인", () => {
        // when
        cy.get("@menuTab").get('[data-cy="menu-tab-쿠폰"]').click()

        // then
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').should('have.class', 'text-main-color')
        cy.get('[data-cy="coupon-list"]').should('be.visible')
        cy.get('[data-cy="coupon-item"]').should('be.visible')
        cy.get('[data-cy="coupon-title"]').should('be.visible')
        cy.get('[data-cy="coupon-content"]').should('be.visible')
        cy.get('[data-cy="coupon-price"]').should('be.visible')
        cy.get('[data-cy="coupon-status"]').should('be.visible')
    })

    describe("판매상품 확인", () => {
        beforeEach(() => {
            // when
            cy.get("@menuTab").get('[data-cy="menu-tab-판매 상품"]').click()

            // then
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').should('have.class', 'text-main-color')
            cy.get('[data-cy="project-item"]').should('be.visible')
            cy.get('[data-cy="project-item"]').should('have.length', 10)
            cy.get('[data-cy="project-name"]').should('be.visible')
            cy.get('[data-cy="project-seller-name"]').should('be.visible')
            cy.get('[data-cy="project-achievement-rate"]').should('be.visible')
            cy.get('[data-cy="project-days-left"]').should('be.visible')
            cy.get('[data-cy="project-end-message"]').should('be.visible')
        })
        it("스크롤 추가 조회", () => {
            // when - 페이지 맨 아래로 스크롤
            cy.scrollTo('bottom')
            
            // 추가 로드된 프로젝트 확인
            cy.get('[data-cy="project-item"]').should('have.length', 12)
    
            // 삭제 버튼 클릭 시 모달 표시 확인
            cy.get('[data-cy="project-item"]').first().find('[data-cy="delete-button"]').click()
            cy.get('[data-cy="delete-modal"]').should('be.visible')
        })

        it("판매상품 수정로 이동", () => {
            // when - 수정, 삭제 버튼 확인
            cy.get('[data-cy="project-item"]').first().within(() => {
                cy.get('[data-cy="edit-button"]').should('be.visible')
                cy.get('[data-cy="delete-button"]').should('be.visible')
            })

            cy.get('[data-cy="project-item"]').first().find('[data-cy="edit-button"]').click()
            
            // then - 수정 페이지로 이동 확인
            cy.url().should('include', '/project/1/edit')
        })

        it("판매상품 삭제", () => {
            cy.intercept({
                method: "DELETE",
                url: "/api/my/project"
            }, {
                fixture: "my/projectAfterDelete.json"
            }).as("deleteProject")

            // when - 수정, 삭제 버튼 확인
            cy.get('[data-cy="project-item"]').first().within(() => {
                cy.get('[data-cy="edit-button"]').should('be.visible')
                cy.get('[data-cy="delete-button"]').should('be.visible')
            })

            cy.get('[data-cy="project-item"]').first().find('[data-cy="delete-button"]').click()

            // then - 삭제 버튼 클릭 시 모달 표시 확인
            cy.get('[data-cy="delete-modal"]').should('be.visible')

            cy.get('[data-cy="delete-modal"]').find('[data-cy="confirm-button"]').click()

            cy.get('[data-cy="delete-modal"]').contains('상품이 성공적으로 삭제되었습니다.').should('be.visible')

            cy.get('[data-cy="delete-modal"]').find('[data-cy="confirm-button"]').click()
            cy.get('[data-cy="delete-modal"]').should('not.exist')

            cy.get('[data-cy="project-item"]').should('have.length', 9)
            cy.get('[data-cy="project-item"]').first().should('contain', '캘리그라피 기초 강좌')
        })
    })

    describe("구매상품 확인", () => {
        beforeEach(() => {
            // when
            cy.get("@menuTab").get('[data-cy="menu-tab-구매 상품"]').click()

            // then
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').should('have.class', 'text-main-color')
            cy.get('[data-cy="order-item"]').should('be.visible') 

            // 구매 상품 목록 확인
            cy.get('[data-cy="order-item"]').should('have.length', 2)
            cy.get('[data-cy="order-item"]').first().should('contain', '가죽 지갑 만들기 키트')
            cy.get('[data-cy="order-item"]').last().should('contain', '소이 캔들 제작 키트')
        })

        it("유효성 오류 후기 작성 시 버튼 비활성화, 에러메세지 확인", () => {
            // 후기 작성 버튼 확인 
            cy.get('[data-cy="order-item"]').first().within(() => {
                cy.get('[data-cy="write-review-button"]').should('be.visible')
                cy.get('[data-cy="write-review-button"]').should('not.be.disabled')
            })
    
            // 후기 작성 버튼 클릭 시 후기 작성 폼 표시 확인
            cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click()
            cy.get('[data-cy="review-form"]').should('be.visible').as("reviewForm")
    
            // 작성 시 버튼 활성화 확인
            cy.get("@reviewForm").get('[data-cy="submit-button"]').should('be.disabled')
            cy.get("@reviewForm").get('[data-cy="review-content"]').type('후기 테스트')
            cy.get("@reviewForm").get('[data-cy="submit-button"]').should('be.enabled')
    
            // 작성 삭제 시 버튼 비활성화 확인, 에러메세지 확인
            cy.get("@reviewForm").get('[data-cy="review-content"]').clear()
            cy.get("@reviewForm").get('[data-cy="submit-button"]').should('be.disabled')
            cy.get("@reviewForm").get('[data-cy="content-error-message"]').should('be.visible')
    
            // 닫기 버튼 클릭 시 후기 작성 폼 닫힘 확인
            cy.get("@reviewForm").find('[data-cy="modal-close-button"]').click()
            cy.get('[data-cy="review-form"]').should('not.exist')
        })

        it("후기 작성 후 후기 작성 버튼 활성화 확인", () => {
            cy.intercept({
                method: "POST",
                url: "/api/comment/create?projectId=11"
            }, {
            }).as("writeReview")

            cy.intercept({
                method: "GET",
                url: "/api/my/order"
            }, {
                fixture: "my/orderAfterWriteReview.json"
            }).as("getMyOrdersAfterWriteReview")

            // 후기 작성 버튼 확인 
            cy.get('[data-cy="order-item"]').first().within(() => {
                cy.get('[data-cy="write-review-button"]').should('be.visible')
                cy.get('[data-cy="write-review-button"]').should('not.be.disabled')
            })
    
            // 후기 작성 버튼 클릭 시 후기 작성 폼 표시 확인
            cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click()
            cy.get('[data-cy="review-form"]').should('be.visible').as("reviewForm")
    
            // 작성 시 버튼 활성화 확인
            cy.get("@reviewForm").get('[data-cy="submit-button"]').should('be.disabled')
            cy.get("@reviewForm").get('[data-cy="review-content"]').type('후기 테스트')

            cy.get("@reviewForm").get('[data-cy="submit-button"]').should('not.be.disabled').click()

            cy.get("@reviewForm").should('not.exist')

            cy.get('[data-cy="order-item"]').first().within(() => {
                cy.get('[data-cy="write-review-button"]').should('be.disabled')
            })
        })

        it("후기 작성된 프로젝트는 후기 작성이 불가함", () => {
            cy.get('[data-cy="order-item"]').last().within(() => {
                cy.get('[data-cy="write-review-button"]').should('be.disabled')
            })
        })
    })

    it("후기 확인", () => {
        // when
        cy.get("@menuTab").get('[data-cy="menu-tab-내가 쓴 후기"]').as("myReviewTab").click()

        // then
        cy.get("@myReviewTab").get('[data-cy="menu-tab-내가 쓴 후기"]').should('have.class', 'text-main-color')
        cy.get('[data-cy="comment-item"]').should('be.visible').as("commentItem")

        cy.get("@commentItem").get('[data-cy="project-image"]').should('be.visible')
        cy.get("@commentItem").get('[data-cy="seller-name"]').should('be.visible')
        cy.get("@commentItem").get('[data-cy="project-name"]').should('be.visible')
        cy.get("@commentItem").get('[data-cy="review-date"]').should('be.visible')
        cy.get("@commentItem").get('[data-cy="review-content"]').should('be.visible')

        cy.get("@commentItem").get('[data-cy="project-image"]').first().click()

        cy.url().should('include', '/project/21')

    })
});