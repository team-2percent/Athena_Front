describe('프로젝트 상세 페이지 (Mock)', () => {
  const mockProjectId = 'test'
  const mockProjectData = {
    id: 9999,
    title: '모킹 프로젝트',
    description: '이것은 Cypress 모킹 테스트용 프로젝트입니다.',
    goalAmount: 1000000,
    totalAmount: 500000,
    markdown: '# 상세 설명\n이 프로젝트는 테스트용입니다.',
    startAt: '2024-06-01',
    endAt: '2024-06-30',
    shippedAt: '2024-07-10',
    imageUrls: [
      "/project-test.png",
      "/project-test2.png",
      "/project-test3.png"
    ],
    sellerResponse: {
      id: 1,
      nickname: '테스트판매자',
      sellerIntroduction: '테스트 판매자 소개',
      linkUrl: 'https://test.com'
    },
    productResponses: [
      {
        id: 1,
        name: '테스트 리워드',
        description: '테스트 리워드 설명',
        price: 10000,
        stock: 10,
        options: []
      }
    ]
  }

  function formatDatePad(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}. ${m}. ${d}.`;
  }

  beforeEach(() => {
    cy.intercept('GET', `/api/project/${mockProjectId}`, {
      statusCode: 200,
      body: { ...mockProjectData }
    }).as('getProjectDetail')

    // 후기 API 인터셉트
    cy.intercept('GET', '/api/comment/test', {
      statusCode: 200,
      body: [
        {
          id: 1,
          userName: '테스트유저',
          content: '이것은 테스트용 후기입니다.',
          createdAt: '2024-06-30T12:00:00Z',
          imageUrl: '/profile-test.png'
        }
      ]
    }).as('getProjectComments')

    cy.visit(`/project/${mockProjectId}`)
    cy.wait('@getProjectDetail')
    cy.wait(2000)
  })

  it('메타데이터가 정상적으로 노출된다', () => {
    cy.contains(mockProjectData.title)
    cy.contains(mockProjectData.description)
    cy.contains('달성 금액')
    cy.contains(`${mockProjectData.totalAmount.toLocaleString()}원`)
    cy.contains(`${mockProjectData.goalAmount.toLocaleString()}원`)
    cy.contains('펀딩 마감까지 남은 시간')
    // 펀딩 마감 날짜
    const endAtStr = formatDatePad(new Date(mockProjectData.endAt))
    cy.contains(endAtStr)
    mockProjectData.imageUrls.forEach((url, idx) => {
      cy.get('[data-cy="project-image"]').should('have.attr', 'src', url)
      if (idx < mockProjectData.imageUrls.length - 1) {
        cy.get('button[aria-label="다음 이미지"]').click()
      }
    })
  })

  it('프로젝트 정보 탭에 데이터가 정상적으로 노출된다', () => {
    cy.contains('프로젝트 정보').click()
    cy.get('[data-cy="project-info-tab"]').within(() => {
      cy.contains(`${mockProjectData.goalAmount.toLocaleString()}원`)
      // 펀딩 기간
      const startAtStr = formatDatePad(new Date(mockProjectData.startAt))
      const endAtStr = formatDatePad(new Date(mockProjectData.endAt))
      cy.contains(`${startAtStr} ~ ${endAtStr}`)
      // 결제 예정
      cy.contains('결제 예정')
      // 예상 발송 시작일
      const shippedAtStr = formatDatePad(new Date(mockProjectData.shippedAt))
      cy.contains(shippedAtStr)
      cy.contains(mockProjectData.sellerResponse.nickname)
      cy.contains(mockProjectData.sellerResponse.sellerIntroduction)
    })
  })

  it('후원 옵션(리워드)이 정상적으로 노출된다', () => {
    // 1. 후원하기 버튼 클릭
    cy.contains('후원하기').should('exist').and('not.be.disabled').click();

    // 2. 상품(리워드) 선택
    cy.contains('테스트 리워드').click();

    // 3. 오른쪽 영역에 선택된 상품 정보가 노출되는지 확인
    cy.contains('선택된 상품').should('be.visible');
    cy.contains('테스트 리워드').should('be.visible');
    cy.contains('1개 × 10,000원 = 10,000원').should('be.visible');

    // 4. chevronRight(펼치기) 버튼 클릭 → 상세 설명 노출 확인
    cy.get('[data-cy="expand-selected-product"]').click();
    cy.contains('테스트 리워드 설명').should('be.visible');
  })

  it('프로젝트 후기 탭에 리뷰가 정상적으로 노출된다', () => {
    cy.contains('후기').click();
    cy.get('[data-cy="review-item"]').should('have.length.at.least', 1);
    cy.get('[data-cy="review-item"]').first().within(() => {
      cy.get('[data-cy="review-username"]').should('not.be.empty');
      cy.get('[data-cy="review-content"]').should('not.be.empty');
      cy.get('[data-cy="review-date"]').should('not.be.empty');
    });
  });

  it('프로젝트 후기 탭에 리뷰가 없을 때 안내 메시지가 노출된다', () => {
    cy.intercept('GET', '/api/comment/*', { statusCode: 200, body: [] });
    cy.reload();
    cy.contains('후기').click();
    cy.contains('아직 리뷰가 없습니다').should('be.visible');
  });
}) 