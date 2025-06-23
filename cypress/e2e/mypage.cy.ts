describe("마이페이지", () => {
    beforeEach(() => {
        // 전역 인터셉트 정리 후 다시 설정
        cy.clearIntercepts();
        
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

        cy.wait('@getUser').its('response.statusCode').should('eq', 200);

        cy.get('[data-cy="profile-header"]').should("be.visible").within(() => {
            cy.get('[data-cy="profile-image"]').should("be.visible");
            cy.get('[data-cy="profile-nickname"]').should("be.visible");
        });
    })

    describe("프로필 헤더", () => {
        it("프로필 조회 로딩", () => {
            // 로딩 테스트를 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'GET', url: '/api/user/57' }, (req) => new Promise(resolve => {
                setTimeout(() => {
                    req.reply({ fixture: 'my/user.json' });
                    resolve();
                }, 1000);
            })).as('getUserDelay');
            
            // 새 페이지 방문 (로딩 상태 확인을 위해)
            cy.visit('/my');
            cy.get('.animate-pulse').should('exist');
            cy.wait('@getUserDelay');
        });
        
        it("프로필 조회 성공", () => {
            // beforeEach에서 이미 페이지가 로드되어 있으므로 추가 방문 불필요
            cy.get('[data-cy="profile-header"]').should('be.visible');
            cy.get('[data-cy="profile-image"]').should('be.visible');
            cy.get('[data-cy="profile-nickname"]').should('be.visible');
            cy.get('[data-cy="edit-profile-button"]').should('be.visible');
        });
        
        it("서버에러로 인한 프로필 조회 실패", () => {
            cy.intercept({ method: 'GET', url: '/api/user/57' }, { statusCode: 500 }).as('getUserError');
            cy.visit('/my');
            cy.get('[data-cy="profile-header"]').should('not.exist');
            cy.contains('프로필 정보를 불러오는 중 오류가 발생했습니다.').should('be.visible');
        });
        
        it("프로필 편집 페이지 이동", () => {
            cy.get('[data-cy="edit-profile-button"]').click();
            cy.url().should('include', '/my/edit');
        });
        
        it("탭 바 이동 및 메뉴 탭 확인", () => {
            const tabs = ['소개', '쿠폰', '판매 상품', '구매 상품', '내가 쓴 후기'];
            tabs.forEach(tab => {
                cy.get('[data-cy="menu-tab"]').get(`[data-cy="menu-tab-${tab}"]`).click();
                cy.get(`[data-cy="menu-tab-${tab}"]`).should('have.class', 'text-main-color');
            });
        });
    });

    describe("소개 탭", () => {
        it("소개 확인", () => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').should('have.class', 'text-main-color')
            cy.get('[data-cy="profile-seller-description"]').should('be.visible')
            cy.get('[data-cy="profile-link-list"]').should('be.visible')
            cy.get('[data-cy="profile-link"]').each(($link) => {
                cy.wrap($link)
                    .should('have.attr', 'href')
                    .and('include', $link.text())
                cy.wrap($link)
                    .should('have.attr', 'target', '_blank')
            })
        });
        
        it('로딩 시 스켈레톤 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/user/57' }, (req) => new Promise(resolve => {
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
        
        it('조회 실패 시 에러 메시지 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/user/57' }, { statusCode: 500 }).as('getUserError');
            cy.visit('/my');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').click();
            cy.contains('소개 정보를 불러오는 중 오류가 발생했습니다.').should('be.visible');
        });
    });

    describe("쿠폰 탭", () => {
        it("보유 쿠폰 확인", () => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').click()
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').should('have.class', 'text-main-color')
            cy.get('[data-cy="coupon-list"]').should('be.visible')
            cy.get('[data-cy="coupon-item"]').should('be.visible')
            cy.get('[data-cy="coupon-title"]').should('be.visible')
            cy.get('[data-cy="coupon-content"]').should('be.visible')
            cy.get('[data-cy="coupon-price"]').should('be.visible')
            cy.get('[data-cy="coupon-status"]').should('be.visible')
        })
        
        it('로딩 시 스켈레톤 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/my/coupon' }, (req) => new Promise(resolve => {
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
        
        it('조회 실패 시 에러 메시지 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/my/coupon' }, { statusCode: 500 }).as('getMyCouponsError');
            cy.visit('/my');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-쿠폰"]').click();
            cy.contains('쿠폰을 불러오는 중 오류가 발생했습니다.').should('be.visible');
        });
    });

    describe("판매 상품 탭", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click()
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').should('have.class', 'text-main-color')
        });
        
        it("판매상품 목록 확인", () => {
            cy.get('[data-cy="project-item"]').should('be.visible')
            cy.get('[data-cy="project-item"]').should('have.length', 10)
            cy.get('[data-cy="project-name"]').should('be.visible')
            cy.get('[data-cy="project-seller-name"]').should('be.visible')
            cy.get('[data-cy="project-achievement-rate"]').should('be.visible')
            cy.get('[data-cy="project-days-left"]').should('be.visible')
            cy.get('[data-cy="project-end-message"]').should('be.visible')
        });
        
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
        });
        
        it("판매상품 수정으로 이동", () => {
            // when - 수정, 삭제 버튼 확인
            cy.get('[data-cy="project-item"]').first().within(() => {
                cy.get('[data-cy="edit-button"]').should('be.visible')
                cy.get('[data-cy="delete-button"]').should('be.visible')
            })

            cy.get('[data-cy="project-item"]').first().find('[data-cy="edit-button"]').click()
            
            // then - 수정 페이지로 이동 확인
            cy.url().should('include', '/project/1/edit')
        });
        
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
        });
        
        it('로딩 시 스켈레톤 노출', () => {
            // 기존 인터셉트를 덮어쓰기 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'GET', url: '/api/my/project' }, (req) => new Promise(resolve => {
                setTimeout(() => {
                    req.reply({ fixture: 'my/project.json' });
                    resolve();
                }, 1000);
            })).as('getMyProjectsDelay');
            
            // 현재 탭에서 새로고침하여 로딩 상태 확인
            cy.reload();
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
            cy.get('.animate-pulse').should('exist');
            cy.wait('@getMyProjectsDelay');
        });
        
        it('조회 실패 시 에러 메시지 노출', () => {
            // 기존 인터셉트를 덮어쓰기 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'GET', url: '/api/my/project' }, { statusCode: 500 }).as('getMyProjectsError');
            
            // 현재 탭에서 새로고침하여 에러 상태 확인
            cy.reload();
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
            cy.contains('판매 상품을 불러오는 중 오류가 발생했습니다.').should('be.visible');
        });
        
        it('데이터 없음 시 메시지 노출', () => {
            // 기존 인터셉트를 덮어쓰기 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'GET', url: '/api/my/project' }, { statusCode: 200, body: [] }).as('getMyProjectsEmpty');
            
            // 현재 탭에서 새로고침하여 빈 데이터 상태 확인
            cy.reload();
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
            cy.contains('판매 중인 상품이 없습니다.').should('be.visible');
        });
        
        it('삭제 실패 시 에러 토스트/모달 노출', () => {
            // 기존 인터셉트를 덮어쓰기 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'DELETE', url: '/api/project/1' }, { statusCode: 500 }).as('deleteProjectError');
            
            // 현재 탭에서 삭제 버튼 클릭
            cy.get('[data-cy="project-item"]').first().find('[data-cy="delete-button"]').click();
            cy.get('[data-cy="delete-modal"]').should('be.visible');
            cy.get('[data-cy="delete-modal"]').find('[data-cy="confirm-button"]').click();
            cy.wait('@deleteProjectError');
            cy.contains('상품 삭제에 실패했습니다.').should('be.visible');
            cy.get('[data-cy="delete-modal"]').should('be.visible');
        });
    });

    describe("구매 상품 탭", () => {
        beforeEach(() => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click()
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').should('have.class', 'text-main-color')
        });
        
        it("구매상품 목록 확인", () => {
            cy.get('[data-cy="order-item"]').should('be.visible') 
            cy.get('[data-cy="order-item"]').should('have.length', 2)
            cy.get('[data-cy="order-item"]').first().should('contain', '가죽 지갑 만들기 키트')
            cy.get('[data-cy="order-item"]').last().should('contain', '소이 캔들 제작 키트')
        });
        
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
        });
        
        it("후기 작성된 프로젝트는 후기 작성이 불가함", () => {
            cy.get('[data-cy="order-item"]').last().within(() => {
                cy.get('[data-cy="write-review-button"]').should('be.disabled')
            })
        });
        
        it('로딩 시 스켈레톤 노출', () => {
            // 기존 인터셉트를 덮어쓰기 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'GET', url: '/api/my/order' }, (req) => new Promise(resolve => {
                setTimeout(() => {
                    req.reply({ fixture: 'my/order.json' });
                    resolve();
                }, 1000);
            })).as('getMyOrdersDelay');
            
            // 현재 탭에서 새로고침하여 로딩 상태 확인
            cy.reload();
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
            cy.get('.animate-pulse').should('exist');
            cy.wait('@getMyOrdersDelay');
        });
        
        it('조회 실패 시 에러 메시지 노출', () => {
            // 기존 인터셉트를 덮어쓰기 위해 새로운 인터셉트 설정
            cy.intercept({ method: 'GET', url: '/api/my/order' }, { statusCode: 500 }).as('getMyOrdersError');
            
            // 현재 탭에서 새로고침하여 에러 상태 확인
            cy.reload();
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
            cy.contains('구매 상품을 불러오는 중 오류가 발생했습니다.').should('be.visible');
        });
        
        it('데이터 없음 시 메시지 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/my/order' }, { statusCode: 200, body: [] }).as('getMyOrdersEmpty');
            cy.visit('/my');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
            cy.contains('구매한 상품이 없습니다').should('be.visible');
        });
        
        it('구매 상품 후기 작성 시 글자수 제한 초과 시 에러 메시지', () => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
            cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click();
            cy.get('[data-cy="review-form"]').get('[data-cy="review-content"]').type('A'.repeat(1001));
            cy.get('[data-cy="content-error-message"]').should('be.visible');
        });
        
        it('구매 상품 후기 작성 시 로딩(스피너) 노출', () => {
            cy.intercept({ method: 'POST', url: '/api/comment/create' }, (req) => new Promise(resolve => {
                setTimeout(() => {
                    req.reply({
                        statusCode: 200,
                        body: {
                            message: "후기가 성공적으로 등록되었습니다."
                        }
                    });
                    resolve();
                }, 1000);
            })).as('writeReviewDelay');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
            cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click();
            cy.get('[data-cy="review-form"]').get('[data-cy="review-content"]').type('후기 테스트');
            cy.get('[data-cy="review-form"]').get('[data-cy="submit-button"]').click();
            cy.get('[data-cy="submit-button"]').should('have.attr', 'data-loading', 'true');
            cy.get('[data-cy="submit-button"]').should('have.attr', 'aria-busy', 'true');
            cy.wait('@writeReviewDelay');
        });
        
        it('구매 상품 후기 작성 실패 시 에러 메시지/토스트 노출', () => {
            cy.intercept({ method: 'POST', url: '/api/comment/create' }, { 
                statusCode: 500,
                body: {
                    message: "후기 작성에 실패했습니다."
                }
            }).as('writeReviewError');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-구매 상품"]').click();
            cy.get('[data-cy="order-item"]').first().find('[data-cy="write-review-button"]').click();
            cy.get('[data-cy="review-form"]').get('[data-cy="review-content"]').type('후기 테스트');
            cy.get('[data-cy="review-form"]').get('[data-cy="submit-button"]').click();
            cy.wait('@writeReviewError');
            cy.contains('후기 작성에 실패했습니다.').should('be.visible');
        });
    });

    describe("후기 탭", () => {
        it("내가 쓴 후기 확인", () => {
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').as("myReviewTab").click()
            cy.get("@myReviewTab").get('[data-cy="menu-tab-내가 쓴 후기"]').should('have.class', 'text-main-color')
            cy.get('[data-cy="comment-item"]').should('be.visible').as("commentItem")
            cy.get("@commentItem").get('[data-cy="project-image"]').should('be.visible')
            cy.get("@commentItem").get('[data-cy="seller-name"]').should('be.visible')
            cy.get("@commentItem").get('[data-cy="project-name"]').should('be.visible')
            cy.get("@commentItem").get('[data-cy="review-date"]').should('be.visible')
            cy.get("@commentItem").get('[data-cy="review-content"]').should('be.visible')
            cy.get("@commentItem").get('[data-cy="project-image"]').first().click()
            cy.url().should('include', '/project/21')
        });
        
        it('로딩 시 스켈레톤 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/my/comment' }, (req) => new Promise(resolve => {
                setTimeout(() => {
                    req.reply({ fixture: 'my/comment.json' });
                    resolve();
                }, 1000);
            })).as('getMyCommentsDelay');
            cy.visit('/my');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').click();
            cy.get('.animate-pulse').should('exist');
            cy.wait('@getMyCommentsDelay').its('response.statusCode').should('eq', 200);
        });
        
        it('조회 실패 시 에러 메시지 노출', () => {
            cy.intercept({ method: 'GET', url: '/api/my/comment' }, { statusCode: 500 }).as('getMyCommentsError');
            cy.visit('/my');
            cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-내가 쓴 후기"]').click();
            cy.contains('후기를 불러오는 중 오류가 발생했습니다.').should('be.visible');
        });
    });

    // 기타: 프로필 편집, 탭 이동 등은 별도 describe로 묶거나 공통으로 둬도 무방
});