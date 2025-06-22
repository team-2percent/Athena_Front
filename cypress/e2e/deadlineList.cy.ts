import { listType, sortName } from '../../src/lib/listConstant';

describe("마감임박 프로젝트 조회", () => {
    beforeEach(() => {
        // given - 마감임박 프로젝트 페이지 방문
        cy.fixture('list/projectList.json').then((projectList) => {
            cy.intercept({
                method: 'GET',
                url: '/api/project/deadlineList?sortTypeDeadline=*',
            }, {
                statusCode: 200,
                body: projectList,
            }).as('getDeadlineProjectList')
        })
        cy.visit('/deadline')
        cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)
    })

    describe("정렬 select 선택", () => {
        describe("정렬 표시", () => {
            it("'/deadline' 방문", () => {
                // then - 정렬 select visible 확인, 최신순 텍스트 확인
                cy.get('[data-cy="list-header-sort-button"]').should('contain', '마감순')

                // when - 정렬 select 클릭
                cy.get('[data-cy="list-header-sort-button"]').click()

                // then - 정렬 select 내 옵션 "마감순", "인기순", "달성률순" 확인
                cy.get('[data-cy="list-header-sort-dropdown"]').should('be.visible')
                cy.get('[data-cy="list-header-sort-dropdown"]').contains('마감순').should('be.visible')
                cy.get('[data-cy="list-header-sort-dropdown"]').contains('인기순').should('be.visible')
                cy.get('[data-cy="list-header-sort-dropdown"]').contains('달성률순').should('be.visible')
            })
        })

        describe("현재 상태인 최신순 설정 시 아무일도 일어나지 않고 select 닫힘", () => {
            it("옵션 '마감순' 클릭", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept({
                        method: 'GET',
                        url: '/api/project/deadlineList?sortTypeDeadline=*',
                    }, {
                        statusCode: 200,
                        body: projectList,
                    }).as('getDeadlineProjectList')
                })

                // given - 페이지 방문 및 초기 로딩 완료
                cy.visit('/deadline')
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

                // when - 정렬 select 클릭
                cy.get('[data-cy="list-header-sort-button"]').click()

                // when - 옵션 '마감순' 클릭
                cy.get('[data-cy="list-header-sort-dropdown"]').contains('마감순').click()

                // then - select 닫힘 확인, select의 text '마감순' 확인
                cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
                cy.get('[data-cy="list-header-sort-button"]').should('contain', '마감순')
            })
        })

        describe("인기순 변경 시 API 요청, select 닫힘", () => {
            it("옵션 '인기순' 클릭", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept({
                        method: 'GET',
                        url: '/api/project/deadlineList?sortTypeDeadline=*',
                    }, {
                        statusCode: 200,
                        body: projectList,
                    }).as('getDeadlineProjectList')
                })

                // given - 페이지 방문 및 초기 로딩 완료
                cy.visit('/deadline')
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

                // when - 정렬 select 클릭
                cy.get('[data-cy="list-header-sort-button"]').click()

                // when - 옵션 '인기순' 클릭
                cy.get('[data-cy="list-header-sort-dropdown"]').contains('인기순').click()

                // then - 인기순 API 요청 확인, select 닫힘 확인, select의 text '인기순' 확인
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
                cy.get('[data-cy="list-header-sort-button"]').should('contain', '인기순')
            })
        })

        describe("달성률순 변경 시 API 요청, select 닫힘", () => {
            it("옵션 '달성률순' 클릭", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept({
                        method: 'GET',
                        url: '/api/project/deadlineList?sortTypeDeadline=*',
                    }, {
                        statusCode: 200,
                        body: projectList,
                    }).as('getDeadlineProjectList')
                })

                // given - 페이지 방문 및 초기 로딩 완료
                cy.visit('/deadline')
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

                // when - 정렬 select 클릭
                cy.get('[data-cy="list-header-sort-button"]').click()

                // when - 옵션 '달성률순' 클릭
                cy.get('[data-cy="list-header-sort-dropdown"]').contains('달성률순').click()

                // then - 달성률순 API 요청 확인, select 닫힘 확인, select의 text '달성률순' 확인
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="list-header-sort-dropdown"]').should('not.exist')
                cy.get('[data-cy="list-header-sort-button"]').should('contain', '달성률순')
            })
        })
    })

    describe("리스트", () => {
        describe("조회 로딩 중 프로젝트 건수 표시 문구, 프로젝트 리스트에 스켈레톤 위치", () => {
            it("프로젝트 GET 요청 중", () => {
                // given - API 응답 설정 (지연 포함)
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept({
                        method: 'GET',
                        url: '/api/project/deadlineList?sortTypeDeadline=*',
                    }, {
                        ...projectList,
                        delay: 1000
                    }).as('getDeadlineProjectList')
                })

                // when - 페이지 방문 (API 요청 시작)
                cy.visit('/deadline')

                // then - 건수 표시 문구 스켈레톤 visible 확인, 리스트 스켈레톤 visible 확인
                cy.get('[data-cy="list-header-count-skeleton"]').should('be.visible')
                cy.get('[data-cy="project-list-skeleton"]').should('be.visible')
            })
        })

        describe("조회 시 20개 이상일 때 프로젝트 건수를 표시하고, 20개로 프로젝트 리스트를 표시", () => {
            it("프로젝트 GET 요청 200", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept({
                        method: 'GET',
                        url: '/api/project/deadlineList?sortTypeDeadline=*',
                    }, {
                        statusCode: 200,
                        body: projectList,
                    }).as('getDeadlineProjectList')
                })

                // when - 페이지 방문
                cy.visit('/deadline')

                // then - API 요청 확인, 건수 표시 확인, 리스트 20개 확인
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '33')
                cy.get('[data-cy="project-list-item"]').should('have.length', 20)
            })
        })

        describe("마지막 추가 조회 시 20개 이내의 다음 프로젝트를 표시하고, loading bar 없음 확인", () => {
            it("프로젝트 추가 GET 요청 200", () => {
                // given - API 응답 설정
                cy.fixture('list/projectList.json').then((projectList) => {
                    cy.intercept({
                        method: 'GET',
                        url: '/api/project/deadlineList?sortTypeDeadline=*',
                    }, {
                        statusCode: 200,
                        body: projectList,
                    }).as('getDeadlineProjectList')
                })

                cy.fixture('list/nextProjectList.json').then((nextProjectList) => {
                    cy.intercept('GET', '/api/project/deadlineList?sortTypeDeadline=*&cursorValue=*&lastProjectId=*', {
                        statusCode: 200,
                        body: nextProjectList,
                    }).as('getNextProjectList')
                })

                // given - 페이지 방문 및 초기 로딩 완료
                cy.visit('/deadline')
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)

                // when - 맨 아래로 스크롤
                cy.scrollTo('bottom')

                // then - loading bar visible 확인, 추가 API 요청 확인, 프로젝트 리스트 사이즈 확인, loading bar not.exist 확인
                cy.get('[data-cy="loading-spinner"]').should('be.visible')
                cy.wait('@getNextProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="project-list-item"]').should('have.length', 33)
                cy.get('[data-cy="loading-spinner"]').should('not.exist')
            })
        })

        describe("데이터가 없을 시 프로젝트 건수를 0으로 표시하고, 비어있음 메시지 표시", () => {
            it("프로젝트 GET 요청 200, 데이터 없음", () => {
                // given - API 응답 설정 (빈 데이터)
                cy.intercept({
                    method: 'GET',
                    url: '/api/project/deadlineList?sortTypeDeadline=*',
                }, {
                    statusCode: 200,
                    body: {
                        content: [],
                        nextCursorValue: null,
                        nextProjectId: null,
                        total: 0
                    }
                }).as('getDeadlineProjectList')

                // when - 페이지 방문
                cy.visit('/deadline')

                // then - API 요청 확인, 건수 표시 '0' 확인, 리스트 0개 확인, 비어있음 메시지 확인
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 200)
                cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '0')
                cy.get('[data-cy="project-list-item"]').should('have.length', 0)
                cy.get('[data-cy="empty-message-card"]').should('be.visible')
                cy.get('[data-cy="empty-message"]').should('be.visible').should('contain', '프로젝트가 없습니다.')
            })
        })

        describe("서버 에러 시 프로젝트 건수를 -으로 표시하고, 서버에러 메시지 표시", () => {
            it("프로젝트 GET 요청 500", () => {
                // given - API 응답 설정 (서버 에러)
                cy.intercept({
                    method: 'GET',
                    url: '/api/project/deadlineList?sortTypeDeadline=*',
                }, {
                    statusCode: 500
                }).as('getDeadlineProjectList')

                // when - 페이지 방문
                cy.visit('/deadline')

                // then - API 요청 500 확인, 건수 표시 '-' 확인, 프로젝트 0개 확인, 서버 에러 메시지 확인
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 500)
                cy.get('[data-cy="list-header-count"]').should('be.visible').should('contain', '-')
                cy.get('[data-cy="project-list-item"]').should('have.length', 0)
                cy.get('[data-cy="server-error-card"]').should('be.visible')
                cy.get('[data-cy="server-error-message"]').should('be.visible').should('contain', '프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요.')

                // when - 다시시도 버튼 클릭
                cy.get('[data-cy="retry-button"]').click()

                // then - 똑같은 API 요청 확인
                cy.wait('@getDeadlineProjectList').its('response.statusCode').should('eq', 500)
            })
        })
    })
})
