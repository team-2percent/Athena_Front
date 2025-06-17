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

        // given - 로그인, 마이페이지 접근

        cy.visitMainPage();
        cy.login();
        cy.visit("/my");

        cy.get('[data-cy="profile-header"]').should("be.visible").within(() => {
            cy.get('[data-cy="profile-image"]').should("be.visible");
            cy.get('[data-cy="profile-nickname"]').should("be.visible");
        });
    })

    it("마이페이지 소개 확인", () => {
        // then
        // 소개 탭이 활성화되어 있는지 확인
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').should('have.class', 'text-main-color')

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
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').click()

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
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click()

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
            cy.intercept({
                method: "GET",
                url: "/api/my/project?nextCursorValue=2024-01-22T12:00:00&nextProjectId=11"
            }, {
                fixture: "my/nextProject.json"
            }).as("getMyNextProjects");
            // when - 페이지 맨 아래로 스크롤
            cy.scrollTo('bottom')
            cy.get('[data-cy="scroll-loader"]').should('be.visible')

            cy.wait('@getMyNextProjects').its('response.statusCode').should('eq', 200)
            
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
                method: "GET",
                url: "/api/my/project"
            }, {
                fixture: "my/nextProject.json"
            }).as("getMyProjects")

            cy.intercept({
                method: "DELETE",
                url: "/api/project/1"
            }, {
                statusCode: 200,
                body: {
                    message: "상품이 성공적으로 삭제되었습니다."
                }
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

            cy.wait('@deleteProject').its('response.statusCode').should('eq', 200)
            cy.wait('@getMyProjects').its('response.statusCode').should('eq', 200)

            cy.get('[data-cy="delete-modal"]').should('not.exist')
            cy.get('[data-cy="project-item"]').should('have.length', 9)
            cy.get('[data-cy="project-item"]').first().should('contain', '캘리그라피 기초 강좌')
        })
    })

    describe("구매상품 확인", () => {
        beforeEach(() => {
            // when
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click()

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
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').as("myReviewTab").click()

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

    it('프로필 조회 로딩 시 스켈레톤 노출', () => {
        cy.intercept('GET', '/api/user/57', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({ fixture: 'my/user.json' });
                resolve();
            }, 1000);
        })).as('getUserDelay');
        cy.visit('/my');
        cy.get('.animate-pulse').should('exist');
        cy.wait('@getUserDelay'); // 200 확인하는 것을 넣는 것이 권장됨
    });

    it('프로필 조회 실패 시 에러 메시지 노출', () => {
        cy.intercept('GET', '/api/user/57', { statusCode: 500 }).as('getUserError');
        cy.visit('/my');
        cy.get('[data-cy="profile-header"]').should('not.exist');
        cy.contains('에러').should('be.visible');
    });

    it('프로필 편집 버튼 클릭 시 /my/edit 이동 및 API 호출', () => {
        cy.get('[data-cy="profile-edit-button"]').click();
        cy.url().should('include', '/my/edit');
    });

    it('탭 바 이동 및 활성화 클래스 확인', () => {
        const tabs = ['소개', '쿠폰', '판매 상품', '구매 상품', '내가 쓴 후기'];
        tabs.forEach(tab => {
            cy.get('[data-cy="menu-tab"]').get(`[data-cy="menu-tab-${tab}"]`).click();
            cy.get(`[data-cy="menu-tab-${tab}"]`).should('have.class', 'text-main-color');
            cy.visit('/my');
        });
    });

    it('소개 탭 로딩 시 스켈레톤 노출', () => {
        cy.intercept('GET', '/api/user/57', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({ fixture: 'my/user.json' });
                resolve();
            }, 1000);
        })).as('getUserDelay');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').click();
        cy.get('.animate-pulse').should('exist');
        cy.wait('@getUserDelay');
    });

    it('소개 탭 실패 시 에러 메시지 노출', () => {
        cy.intercept('GET', '/api/user/57', { statusCode: 500 }).as('getUserError');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').click();
        cy.contains('에러').should('be.visible');
    });

    it('쿠폰 탭 로딩 시 스켈레톤 노출', () => {
        cy.intercept('GET', '/api/my/coupon', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({ fixture: 'my/coupon.json' });
                resolve();
            }, 1000);
        })).as('getMyCouponsDelay');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').click();
        cy.get('.animate-pulse').should('exist');
        cy.wait('@getMyCouponsDelay');
    });

    it('쿠폰 탭 실패 시 에러 메시지 노출', () => {
        cy.intercept('GET', '/api/my/coupon', { statusCode: 500 }).as('getMyCouponsError');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').click();
        cy.contains('에러').should('be.visible');
    });

    it('판매 상품 조회 로딩 시 스켈레톤 노출', () => {
        cy.intercept('GET', '/api/my/project', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({ fixture: 'my/project.json' });
                resolve();
            }, 1000);
        })).as('getMyProjectsDelay');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
        cy.get('.animate-pulse').should('exist');
        cy.wait('@getMyProjectsDelay');
    });

    it('판매 상품 조회 성공, 데이터 없음 시 메시지 노출', () => {
        cy.intercept('GET', '/api/my/project', { statusCode: 200, body: [] }).as('getMyProjectsEmpty');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
        cy.contains('판매 중인 상품이 없습니다.').should('be.visible');
    });

    it('판매 상품 조회 실패 시 에러 메시지 노출', () => {
        cy.intercept('GET', '/api/my/project', { statusCode: 500 }).as('getMyProjectsError');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
        cy.contains('에러').should('be.visible');
    });

    it('판매 상품 삭제 실패 시 에러 토스트/모달 노출', () => {
        cy.intercept('DELETE', '/api/project/1', { statusCode: 500 }).as('deleteProjectError');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
        cy.get('[data-cy="project-item"]').first().find('[data-cy="delete-button"]').click();
        cy.get('[data-cy="delete-modal"]').should('be.visible');
        cy.get('[data-cy="delete-modal"]').find('[data-cy="confirm-button"]').click();
        cy.wait('@deleteProjectError');
        cy.contains('판매 상품 삭제 실패').should('be.visible');
        cy.get('[data-cy="delete-modal"]').should('be.visible');
    });

    it('구매 상품 조회 로딩 시 스켈레톤 노출', () => {
        cy.intercept('GET', '/api/my/order', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({ fixture: 'my/order.json' });
                resolve();
            }, 1000);
        })).as('getMyOrdersDelay');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
        cy.get('.animate-pulse').should('exist');
        cy.wait('@getMyOrdersDelay');
    });

    it('구매 상품 조회 성공, 데이터 없음 시 메시지 노출', () => {
        cy.intercept('GET', '/api/my/order', { statusCode: 200, body: [] }).as('getMyOrdersEmpty');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
        cy.contains('구매한 상품이 없습니다').should('be.visible');
    });

    it('구매 상품 조회 실패 시 에러 메시지 노출', () => {
        cy.intercept('GET', '/api/my/order', { statusCode: 500 }).as('getMyOrdersError');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
        cy.contains('에러').should('be.visible');
    });

    it('구매 상품 후기 작성 시 글자수 제한 초과 시 에러 메시지', () => {
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
        cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click();
        cy.get('[data-cy="review-form"]').get('[data-cy="review-content"]').type('A'.repeat(301));
        cy.get('[data-cy="content-error-message"]').should('be.visible');
    });

    it('구매 상품 후기 작성 시 로딩(스피너) 노출', () => {
        cy.intercept('POST', '/api/comment/create?projectId=11', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({});
                resolve();
            }, 1000);
        })).as('writeReviewDelay');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
        cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click();
        cy.get('[data-cy="review-form"]').get('[data-cy="review-content"]').type('후기 테스트');
        cy.get('[data-cy="review-form"]').get('[data-cy="submit-button"]').click();
        cy.get('[data-cy="submit-button"]').should('have.class', 'spinner'); // 실제 스피너 클래스에 맞게 수정 필요
        cy.wait('@writeReviewDelay');
    });

    it('구매 상품 후기 작성 실패 시 에러 메시지/토스트 노출', () => {
        cy.intercept('POST', '/api/comment/create?projectId=11', { statusCode: 500 }).as('writeReviewError');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
        cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click();
        cy.get('[data-cy="review-form"]').get('[data-cy="review-content"]').type('후기 테스트');
        cy.get('[data-cy="review-form"]').get('[data-cy="submit-button"]').click();
        cy.wait('@writeReviewError');
        cy.contains('후기 작성 실패').should('be.visible');
    });

    it('내가 쓴 후기 조회 로딩 시 스켈레톤 노출', () => {
        cy.intercept('GET', '/api/my/comment', (req) => new Promise(resolve => {
            setTimeout(() => {
                req.reply({ fixture: 'my/comment.json' });
                resolve();
            }, 1000);
        })).as('getMyCommentsDelay');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').click();
        cy.get('.animate-pulse').should('exist');
        cy.wait('@getMyCommentsDelay');
    });

    it('내가 쓴 후기 조회 성공, 데이터 없음 시 메시지 노출', () => {
        cy.intercept('GET', '/api/my/comment', { statusCode: 200, body: [] }).as('getMyCommentsEmpty');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').click();
        cy.contains('작성한 후기가 없습니다').should('be.visible');
    });

    it('내가 쓴 후기 조회 실패 시 에러 메시지 노출', () => {
        cy.intercept('GET', '/api/my/comment', { statusCode: 500 }).as('getMyCommentsError');
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').click();
        cy.contains('에러').should('be.visible');
    });

    it('내가 쓴 후기 상세 보기', () => {
        cy.visit('/my');
        cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').click();
        cy.get('[data-cy="comment-item"]').first().click();
        cy.get('[data-cy="review-modal"]').should('be.visible');
        cy.get('[data-cy="review-modal"]').within(() => {
            cy.get('[data-cy="review-date"]').should('be.visible');
            cy.get('[data-cy="review-content"]').should('be.visible');
        });
    });
});